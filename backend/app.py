from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pickle
import pandas as pd
from dotenv import load_dotenv

import numpy as np
import os
load_dotenv()
from datetime import datetime

app = Flask(__name__)
CORS(app)


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, 'models')
DATA_DIR = os.path.join(BASE_DIR, 'data')
VIZ_DIR = os.path.join(BASE_DIR, 'visualizations')


model = None
label_encoders = None
feature_info = None
model_info = None
poly = None
kmeans = None
cluster_scaler = None

# ============================
# LOAD MODELS
# ============================
def load_models():
    global model, label_encoders, feature_info, model_info, poly, kmeans, cluster_scaler
    print("\n" + "=" * 60)
    print("📦 Loading ML Models...")
    print("=" * 60)
    try:
        def load(file):
            path = os.path.join(MODEL_DIR, file)
            print(f"   Loading: {file}")
            with open(path, "rb") as f:
                return pickle.load(f)

        model = load("best_model.pkl")
        label_encoders = load("label_encoders.pkl")
        feature_info = load("feature_info.pkl")
        model_info = load("model_info.pkl")
        poly = load("poly_transformer.pkl")
        kmeans = load("kmeans_model.pkl")
        cluster_scaler = load("cluster_scaler.pkl")

        print("✅ All models loaded successfully!")
        print(f"   Model: {model_info.get('model_name', 'Unknown')}")
        print(f"   Accuracy: {model_info.get('test_r2', 0):.4f}")
        print("=" * 60 + "\n")
        return True

    except Exception as e:
        print(f"❌ Error loading models: {e}")
        print(f"   MODEL_DIR: {MODEL_DIR}")
        return False

# ============================
# CITY MAPPING
# ============================
CITY_MAPPING = {
    'karachi': 'karachi', 'hyderabad': 'karachi', 'sukkur': 'karachi',
    'larkana': 'karachi', 'mirpurkhas': 'karachi',
    'lahore': 'lahore', 'faisalabad': 'lahore', 'multan': 'lahore',
    'gujranwala': 'lahore', 'sialkot': 'lahore', 'bahawalpur': 'lahore',
    'sargodha': 'lahore', 'sahiwal': 'lahore',
    'islamabad': 'islamabad', 'rawalpindi': 'islamabad', 'peshawar': 'islamabad',
    'abbottabad': 'islamabad', 'mardan': 'islamabad', 'quetta': 'islamabad',
    'khi': 'karachi', 'lhr': 'lahore', 'isb': 'islamabad', 'pindi': 'islamabad'
}

def map_city(city):
    city_lower = city.lower().strip()
    mapped = CITY_MAPPING.get(city_lower, "karachi")
    was_mapped = mapped != city_lower
    return mapped, was_mapped

# ============================
# IMPROVED SEGMENT LOGIC
# ============================
def determine_segment(predicted_price, car_data):
    """
    Improved segment determination logic
    Fixed thresholds for Pakistani market + clustering support
    """
    segment = None
    method = "fallback"
    
    # Try clustering first (if available)
    if kmeans is not None and cluster_scaler is not None:
        try:
            expected_features = cluster_scaler.n_features_in_
            
            # Prepare cluster input based on scaler expectations
            if expected_features == 3:
                cluster_input = np.array([[
                    predicted_price, 
                    car_data['registered_in'], 
                    car_data['mileage']
                ]])
            elif expected_features == 4:
                cluster_input = np.array([[
                    predicted_price, 
                    car_data['registered_in'], 
                    car_data['mileage'], 
                    car_data['engine']
                ]])
            else:
                cluster_input = np.array([[
                    predicted_price, 
                    car_data['registered_in'], 
                    car_data['mileage']
                ]])

            cluster_scaled = cluster_scaler.transform(cluster_input)
            cluster_id = int(kmeans.predict(cluster_scaled)[0])
            
            # Get cluster mapping (with better defaults)
            cluster_map = feature_info.get('cluster_map', {
                0: 'Economy', 
                1: 'Mid-Range', 
                2: 'Premium',
                3: 'Luxury'
            })
            
            segment = cluster_map.get(cluster_id)
            method = "clustering"
            
            # Validate clustering result against price
            # If clustering gives unrealistic result, use fallback
            if segment == "Economy" and predicted_price > 3500000:
                print(f"⚠️ Clustering anomaly: {segment} for price {predicted_price:,.0f}")
                segment = None  # Force fallback
            elif segment == "Luxury" and predicted_price < 5000000:
                print(f"⚠️ Clustering anomaly: {segment} for price {predicted_price:,.0f}")
                segment = None  # Force fallback
                
        except Exception as cluster_error:
            print(f"⚠️ Clustering error: {cluster_error}")
            segment = None

    # Fallback to rule-based (FIXED THRESHOLDS for Pakistani market)
    if segment is None:
        method = "rule-based"
        if predicted_price < 2000000:  # Less than 20 Lacs
            segment = "Economy"
        elif predicted_price < 4000000:  # 20-40 Lacs
            segment = "Mid-Range"
        elif predicted_price < 7000000:  # 40-70 Lacs
            segment = "Premium"
        else:  # Above 70 Lacs
            segment = "Luxury"
    
    return segment, method

# ============================
# VALIDATION HELPERS
# ============================
def validate_prediction(predicted_price, input_data):
    """Sanity checks and warnings for predictions"""
    warnings = []
    
    # Calculate car age
    current_year = datetime.now().year
    car_age = current_year - input_data['registered_in']
    
    # Warning: Very high price for old car
    if predicted_price > 10000000 and car_age > 10:
        warnings.append("⚠️ Unusually high price for vehicle age")
    
    # Warning: Very low price for new car
    if predicted_price < 1000000 and car_age < 3:
        warnings.append("⚠️ Price seems low for recent model")
    
    # Warning: High mileage impact
    if input_data['mileage'] > 150000:
        warnings.append("⚠️ High mileage may affect actual resale value")
    
    # Warning: Very low mileage (suspiciously low)
    if input_data['mileage'] < 10000 and car_age > 5:
        warnings.append("⚠️ Unusually low mileage for vehicle age")
    
    return warnings

def format_price_display(price):
    """Format price in multiple representations"""
    return {
        "pkr": int(price),
        "lacs": round(price / 100000, 2),
        "crores": round(price / 10000000, 2) if price >= 10000000 else None,
        "formatted": f"{int(price):,} PKR"
    }

# ============================
# HOME
# ============================
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "🚗 AI Car Price Predictor API",
        "version": "2.0.0",
        "status": "running",
        "endpoints": {
            "health": "/api/health",
            "model_info": "/api/model-info",
            "feature_options": "/api/feature-options",
            "predict": "/api/predict (POST)",
            "batch_predict": "/api/predict/batch (POST)",
            "analytics": "/api/analytics/stats",
            "visualizations": "/api/visualizations/<type>",
            "chatbot": "/api/chatbot (POST)",
            "price_trend": "/api/price-trend (POST)"
        },
        "documentation": "http://localhost:5000/docs"
    })

# ============================
# HEALTH
# ============================
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "poly_loaded": poly is not None,
        "kmeans_loaded": kmeans is not None,
        "timestamp": datetime.now().isoformat()
    })

# ============================
# MODEL INFO
# ============================
@app.route("/api/model-info", methods=["GET"])
def model_details():
    if not model:
        return jsonify({"error": "Model not loaded"}), 500
    
    return jsonify({
        "model_name": model_info.get("model_name"),
        "accuracy_r2": float(model_info.get("test_r2", 0)),
        "mae": float(model_info.get("test_mae", 0)),
        "rmse": float(model_info.get("test_rmse", 0)),
        "mape": float(model_info.get("test_mape", 0)) if "test_mape" in model_info else None,
        "features": {
            "categorical": feature_info["categorical_features"],
            "numerical": feature_info["numerical_features"],
            "total_features": len(model_info.get("feature_columns", []))
        },
        "polynomial_features": poly is not None,
        "clustering": kmeans is not None
    })

# ============================
# FEATURE OPTIONS
# ============================
@app.route("/api/feature-options", methods=["GET"])
def feature_options():
    try:
        df = pd.read_csv(os.path.join(DATA_DIR, "pakwheels_cleaned.csv"))
        options = {}
        for col in feature_info["categorical_features"]:
            options[col] = sorted(df[col].astype(str).unique().tolist())
        for col in feature_info["numerical_features"]:
            options[col] = {
                "min": float(df[col].min()),
                "max": float(df[col].max()),
                "mean": float(df[col].mean()),
                "median": float(df[col].median())
            }
        return jsonify({
            "options": options,
            "total_records": int(len(df)),
            "cities_supported": list(set(CITY_MAPPING.values())),
            "all_city_names": list(CITY_MAPPING.keys())
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ============================
# PREDICTION (IMPROVED)
# ============================
@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        required_fields = feature_info["categorical_features"] + feature_info["numerical_features"]
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({"error": f"Missing fields: {missing}"}), 400

        return make_prediction(data)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ============================
# PRICE TREND (FIXED - WITH INFLATION)
# ============================
@app.route("/api/price-trend", methods=["POST"])
def get_price_trend():
    """
    FIXED: Get historical price trend with Pakistani market inflation
    Shows realistic price increases due to inflation + depreciation due to wear
    """
    try:
        data = request.json
        
        # Extract car details
        car_brand = data.get('car_brand', '').lower().strip()
        car_model = data.get('car_model', '').lower().strip()
        fuel_type = data.get('fuel_type', '').lower().strip()
        transmission = data.get('transmission', '').lower().strip()
        engine = int(data.get('engine', 0))
        current_mileage = int(data.get('mileage', 0))
        registered_year = int(data.get('registered_in'))
        predicted_price = float(data.get('predicted_price', 0))
        
        # Load dataset
        df = pd.read_csv(os.path.join(DATA_DIR, "pakwheels_cleaned.csv"))
        
        # Filter data for same car specs
        filtered_df = df[
            (df['car_brand'].str.lower() == car_brand) &
            (df['car_model'].str.lower() == car_model) &
            (df['fuel_type'].str.lower() == fuel_type) &
            (df['transmission'].str.lower() == transmission)
        ].copy()
        
        # If we have engine data, filter by similar engine size (±200 CC tolerance)
        if engine > 0:
            filtered_df = filtered_df[
                (filtered_df['engine'] >= engine - 200) &
                (filtered_df['engine'] <= engine + 200)
            ]
        
        print(f"📊 Found {len(filtered_df)} matching cars in dataset")
        
        current_year = datetime.now().year
        car_age = current_year - registered_year
        
        # ==========================================
        # SCENARIO 1: REAL MARKET DATA (Best - NO ADJUSTMENTS)
        # ==========================================
        if len(filtered_df) >= 5:
            # Get ACTUAL average prices per year from market data
            yearly_data = filtered_df.groupby('registered_in').agg({
                'price': ['mean', 'count', 'std', 'min', 'max']
            }).reset_index()
            
            yearly_data.columns = ['year', 'avg_price', 'count', 'std_price', 'min_price', 'max_price']
            yearly_data = yearly_data.sort_values('year')
            yearly_data = yearly_data[yearly_data['count'] >= 2]  # At least 2 cars per year
            
            years = yearly_data['year'].astype(int).tolist()
            prices = yearly_data['avg_price'].astype(float).tolist()
            
            # Add current year with predicted price
            if registered_year not in years:
                years.append(registered_year)
                prices.append(predicted_price)
                # Sort by year
                years, prices = zip(*sorted(zip(years, prices)))
                years, prices = list(years), list(prices)
            else:
                # Update the registered year price with current prediction
                idx = years.index(registered_year)
                prices[idx] = predicted_price
            
            # Only show years from registered_in to current year (no ancient data)
            # Filter to only show from car's registration year onwards
            all_years = list(range(registered_year, current_year + 1))
            filled_prices = []
            
            for year in all_years:
                if year in years:
                    filled_prices.append(prices[years.index(year)])
                else:
                    # Linear interpolation between known years
                    lower_years = [y for y in years if y < year and y >= registered_year]
                    upper_years = [y for y in years if y > year]
                    
                    if lower_years and upper_years:
                        y1, y2 = max(lower_years), min(upper_years)
                        p1, p2 = prices[years.index(y1)], prices[years.index(y2)]
                        interpolated = p1 + (p2 - p1) * (year - y1) / (y2 - y1)
                        filled_prices.append(interpolated)
                    elif lower_years:
                        filled_prices.append(prices[years.index(max(lower_years))])
                    elif upper_years:
                        filled_prices.append(prices[years.index(min(upper_years))])
            
            years = all_years
            prices = filled_prices
            data_source = 'real_market_data'
            reliability = 'high' if len(filtered_df) >= 10 else 'medium'
            
            print(f"✅ Using REAL market prices for {len(years)} years")
        
        # ==========================================
        # SCENARIO 2: BRAND-LEVEL DATA
        # ==========================================
        elif len(filtered_df) >= 1:
            print("⚠️ Limited exact matches, using brand-level depreciation curve")
            
            brand_df = df[df['car_brand'].str.lower() == car_brand].copy()
            brand_df['car_age'] = current_year - brand_df['registered_in']
            brand_df = brand_df[brand_df['car_age'] > 0]
            
            # Calculate average depreciation rate from brand data
            if len(brand_df) > 10:
                # Get average price by car age
                age_prices = brand_df.groupby('car_age')['price'].mean().sort_index()
                
                # Calculate average depreciation per year
                if len(age_prices) > 1:
                    total_depreciation = age_prices.iloc[0] - age_prices.iloc[-1]
                    years_span = age_prices.index[-1] - age_prices.index[0]
                    avg_depreciation_per_year = total_depreciation / years_span if years_span > 0 else predicted_price * 0.10
                else:
                    avg_depreciation_per_year = predicted_price * 0.10  # 10% per year
            else:
                avg_depreciation_per_year = predicted_price * 0.10
            
            # Generate trend using depreciation rate
            years = []
            prices = []
            
            for i in range(car_age + 1):
                year = registered_year + i
                years_old = i
                
                # Calculate price at that time (working backwards from current)
                depreciation = avg_depreciation_per_year * (car_age - years_old)
                price = predicted_price + depreciation
                
                years.append(year)
                prices.append(max(float(price), predicted_price * 0.2))  # Floor at 20%
            
            data_source = 'estimated_brand_data'
            reliability = 'medium'
            
            print(f"✅ Generated trend using brand depreciation model")
        
        # ==========================================
        # SCENARIO 3: PAKISTANI MARKET MODEL (WITH INFLATION)
        # ==========================================
        else:
            print("⚠️ No matching data, using Pakistani market inflation model")
            
            # Pakistani market: Inflation rates (actual historical trends)
            # Last few years mein 20-30% inflation tha!
            inflation_by_year = {
                2018: 0.05,   # 5% inflation
                2019: 0.07,   # 7% inflation
                2020: 0.10,   # 10% inflation (COVID impact)
                2021: 0.09,   # 9% inflation
                2022: 0.12,   # 12% inflation (dollar crisis start)
                2023: 0.25,   # 25% inflation (economic crisis peak)
                2024: 0.22,   # 22% inflation (still high)
                2025: 0.15,   # 15% inflation (improving)
                2026: 0.12,   # 12% inflation (current)
            }
            
            # Physical depreciation (car getting older)
            physical_depreciation = {
                1: 0.10,   # 10% physical wear (year 1)
                2: 0.08,   # 8% (year 2)
                3: 0.07,   # 7% (year 3)
                4: 0.06,   # 6% (year 4)
                5: 0.05,   # 5% (year 5+)
            }
            
            years = []
            prices = []
            
            # Start from registered year
            # Calculate "original price" (what it was worth in registered year)
            # Work backwards from current predicted price
            
            # Net effect = Inflation - Physical Depreciation
            # Calculate cumulative effect from registered year to now
            cumulative_effect = 1.0
            
            for year in range(registered_year + 1, current_year + 1):
                age = year - registered_year
                inflation_rate = inflation_by_year.get(year, 0.10)  # default 10%
                depreciation_rate = physical_depreciation.get(age, 0.05)
                
                # Net effect: price increases by inflation but decreases by wear
                net_rate = inflation_rate - depreciation_rate
                cumulative_effect *= (1 + net_rate)
            
            # Original price = current price / cumulative effect
            original_price = predicted_price / cumulative_effect if cumulative_effect > 0 else predicted_price
            
            # Now generate forward trend
            current_value = original_price
            
            for i in range(car_age + 1):
                year = registered_year + i
                
                if i == 0:
                    # Purchase year
                    price = original_price
                else:
                    # Apply net effect (inflation - depreciation)
                    age = i
                    inflation_rate = inflation_by_year.get(year, 0.10)
                    depreciation_rate = physical_depreciation.get(age, 0.05)
                    net_rate = inflation_rate - depreciation_rate
                    
                    current_value = current_value * (1 + net_rate)
                    price = current_value
                
                years.append(year)
                prices.append(float(price))
            
            # Ensure current year matches prediction exactly
            if len(prices) > 0:
                prices[-1] = predicted_price
            
            data_source = 'estimated_with_inflation'
            reliability = 'medium'
            
            print(f"✅ Generated trend using Pakistani inflation model")
        
        # Ensure current year has exact predicted price
        if current_year in years:
            idx = years.index(current_year)
            prices[idx] = predicted_price
        else:
            years.append(current_year)
            prices.append(predicted_price)
            years, prices = zip(*sorted(zip(years, prices)))
            years, prices = list(years), list(prices)
        
        # ==========================================
        # CALCULATE STATISTICS
        # ==========================================
        if len(prices) > 1:
            # Price at purchase vs current
            price_at_purchase = prices[0]
            current_value = predicted_price
            total_change = current_value - price_at_purchase
            total_change_pct = (total_change / price_at_purchase * 100) if price_at_purchase > 0 else 0
            
            # Average per year
            avg_change_per_year = total_change / car_age if car_age > 0 else 0
            
            # Determine trend
            if total_change > 0:
                trend_direction = "increasing"
                trend_label = "appreciation"
            elif total_change < 0:
                trend_direction = "decreasing"
                trend_label = "depreciation"
            else:
                trend_direction = "stable"
                trend_label = "stable"
        else:
            price_at_purchase = predicted_price
            current_value = predicted_price
            total_change = 0
            total_change_pct = 0
            avg_change_per_year = 0
            trend_direction = "stable"
            trend_label = "stable"
        
        return jsonify({
            'success': True,
            'trend_data': {
                'years': years,
                'prices': prices,
                'current_year': current_year
            },
            'statistics': {
                'price_at_purchase': float(price_at_purchase),
                'current_estimated_value': float(current_value),
                'total_value_change': float(total_change),
                'value_change_percentage': float(total_change_pct),
                'avg_change_per_year': float(avg_change_per_year),
                'trend_direction': trend_direction,
                'trend_label': trend_label,
                'is_appreciating': total_change > 0
            },
            'metadata': {
                'data_source': data_source,
                'reliability': reliability,
                'matching_cars_found': len(filtered_df),
                'years_analyzed': len(years),
                'car_age': car_age
            },
            'market_insights': {
                'message': (
                    f"This {car_brand.title()} {car_model.title()} was worth approximately "
                    f"{(price_at_purchase/100000):.2f} Lacs when registered in {registered_year}. "
                    f"Current estimated value: {(current_value/100000):.2f} Lacs. "
                    f"{'📈 Value increased by ' + f'{abs(total_change_pct):.1f}% due to high inflation in Pakistan (especially 2022-2024).' if total_change > 0 else '📉 Despite inflation, natural wear and tear caused ' + f'{abs(total_change_pct):.1f}% depreciation.' if total_change < 0 else '➡️ Value remained stable over time.'}"
                )
            }
        })
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False, 
            'error': str(e),
            'message': 'Unable to generate price trend'
        }), 500

# ============================
# BATCH PREDICTION (NEW)
# ============================
@app.route("/api/predict/batch", methods=["POST"])
def batch_predict():
    """Predict prices for multiple cars at once"""
    try:
        data = request.json
        cars = data.get("cars", [])
        
        if not cars or not isinstance(cars, list):
            return jsonify({"error": "Expected 'cars' array in request"}), 400
        
        results = []
        for idx, car_data in enumerate(cars):
            try:
                prediction = make_prediction(car_data).json
                prediction['index'] = idx
                results.append(prediction)
            except Exception as e:
                results.append({
                    "index": idx,
                    "success": False,
                    "error": str(e)
                })
        
        # Summary statistics
        successful = [r for r in results if r.get('success')]
        if successful:
            prices = [r['predicted_price'] for r in successful]
            summary = {
                "total_predictions": len(results),
                "successful": len(successful),
                "failed": len(results) - len(successful),
                "price_range": {
                    "min": min(prices),
                    "max": max(prices),
                    "average": sum(prices) / len(prices)
                }
            }
        else:
            summary = {
                "total_predictions": len(results),
                "successful": 0,
                "failed": len(results)
            }
        
        return jsonify({
            "success": True,
            "results": results,
            "summary": summary,
            "timestamp": datetime.now().isoformat()
        })
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

# ============================
# HELPER FUNCTION (IMPROVED)
# ============================
def make_prediction(data):
    try:
        original_city = data.get("city", "karachi")
        mapped_city, was_mapped = map_city(original_city)
        data["city"] = mapped_city

        feature_vector = []
        for col in feature_info["categorical_features"]:
            val = str(data[col]).lower().strip()
            try:
                encoded_val = label_encoders[col].transform([val])[0]
                feature_vector.append(encoded_val)
            except:
                feature_vector.append(0)

        numerical_values = [float(data[col]) for col in feature_info["numerical_features"]]

        if poly is not None:
            numerical_array = np.array([numerical_values])
            poly_features = poly.transform(numerical_array)
            poly_feature_names = poly.get_feature_names_out(feature_info["numerical_features"])
            all_features = feature_vector + poly_features[0].tolist()
            feature_columns = [f"{col}_encoded" for col in feature_info["categorical_features"]]
            feature_columns.extend(poly_feature_names)
        else:
            all_features = feature_vector + numerical_values
            feature_columns = [f"{col}_encoded" for col in feature_info["categorical_features"]]
            feature_columns.extend(feature_info["numerical_features"])

        df_input = pd.DataFrame([all_features], columns=feature_columns)

        if 'feature_columns' in model_info:
            training_columns = model_info['feature_columns']
            for col in training_columns:
                if col not in df_input.columns:
                    df_input[col] = 0
            df_input = df_input[training_columns]

        predicted_price = float(model.predict(df_input)[0])
        price_min = predicted_price * 0.90
        price_max = predicted_price * 1.10

        # FIXED SEGMENT DETERMINATION
        segment, segment_method = determine_segment(predicted_price, data)
        
        # Validation warnings
        warnings = validate_prediction(predicted_price, data)
        
        # Calculate car age
        car_age = datetime.now().year - data['registered_in']
        
        # Confidence score (based on model accuracy and warnings)
        confidence = "high" if model_info.get("test_r2", 0) > 0.90 and len(warnings) == 0 else "medium"
        if len(warnings) > 2:
            confidence = "low"

        return jsonify({
            "success": True,
            "predicted_price": predicted_price,
            "price_display": format_price_display(predicted_price),
            "price_range": {
                "min": price_min,
                "max": price_max,
                "min_display": format_price_display(price_min),
                "max_display": format_price_display(price_max)
            },
            "segment": segment,
            "segment_method": segment_method,
            "car_info": {
                "age": car_age,
                "age_category": "new" if car_age <= 3 else "used" if car_age <= 7 else "old",
                "original_city": original_city,
                "mapped_city": mapped_city,
                "city_mapped": was_mapped
            },
            "model_performance": {
                "accuracy_r2": float(model_info.get("test_r2", 0)),
                "average_error_pkr": float(model_info.get("test_mae", 0)),
                "confidence": confidence
            },
            "warnings": warnings,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)})

# ============================
# ANALYTICS (ENHANCED)
# ============================
@app.route("/api/analytics/stats", methods=["GET"])
def analytics():
    try:
        df = pd.read_csv(os.path.join(DATA_DIR, "pakwheels_cleaned.csv"))
        def clean(d):
            return {str(k): int(v) if isinstance(v, (np.integer, np.int64)) else float(v) for k, v in d.items()}

        # Segment distribution
        segment_stats = []
        for threshold, name in [(2000000, "Economy"), (4000000, "Mid-Range"), (7000000, "Premium")]:
            count = len(df[df['price'] < threshold])
            segment_stats.append({
                "segment": name,
                "count": count,
                "percentage": round(count / len(df) * 100, 2)
            })
        luxury_count = len(df[df['price'] >= 7000000])
        segment_stats.append({
            "segment": "Luxury",
            "count": luxury_count,
            "percentage": round(luxury_count / len(df) * 100, 2)
        })

        return jsonify({
            "dataset": {
                "total_cars": int(len(df)),
                "year_range": f"{int(df['registered_in'].min())} - {int(df['registered_in'].max())}",
                "mileage_range": f"{int(df['mileage'].min())} - {int(df['mileage'].max())} km"
            },
            "price_stats": {
                "min": float(df["price"].min()),
                "max": float(df["price"].max()),
                "mean": float(df["price"].mean()),
                "median": float(df["price"].median()),
                "std": float(df["price"].std())
            },
            "segment_distribution": segment_stats,
            "top_brands": clean(df["car_brand"].value_counts().head(10).to_dict()),
            "top_models": clean(df["car_model"].value_counts().head(10).to_dict()),
            "fuel_type_distribution": clean(df["fuel_type"].value_counts().to_dict()),
            "transmission_distribution": clean(df["transmission"].value_counts().to_dict()),
            "city_distribution": clean(df["city"].value_counts().to_dict())
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ============================
# VISUALIZATIONS
# ============================
@app.route("/api/visualizations/<name>")
def visualizations(name):
    files = {
        "actual_vs_predicted": "actual_vs_predicted.png",
        "feature_importance": "feature_importance.png",
        "model_comparison": "model_comparison.png",
        "error_distribution": "error_distribution.png"
    }

    if name not in files:
        return jsonify({"error": "Invalid visualization name", "available": list(files.keys())}), 404

    path = os.path.join(VIZ_DIR, files[name])
    if not os.path.exists(path):
        return jsonify({"error": f"File not found: {files[name]}"}), 404

    return send_file(path, mimetype="image/png")

# ============================
# CHATBOT (IMPROVED)
# ============================
from chatbot import chatbot as ai_chatbot

@app.route("/api/chatbot", methods=["POST"])
def chatbot_endpoint():
    try:
        data = request.json
        session_id = data.get("session_id", "default")
        message = data.get("message", "")
        response = ai_chatbot.process_message(session_id=session_id, message=message, model_info=model_info)

        if response.get('action') == 'predict' and 'data' in response:
            car_data = response['data']
            try:
                car_data['engine'] = float(str(car_data['engine']).replace(',', ''))
                car_data['registered_in'] = int(str(car_data['registered_in']).replace(',', ''))
                car_data['mileage'] = float(str(car_data['mileage']).replace(',', ''))
            except ValueError as ve:
                response['reply'] = f"❌ Invalid data format: {str(ve)}"
                response['timestamp'] = datetime.now().isoformat()
                return jsonify(response)

            prediction_result = make_prediction(car_data).json
            if prediction_result['success']:
                pred = prediction_result
                warning_text = "\n⚠️ " + "\n⚠️ ".join(pred.get('warnings', [])) if pred.get('warnings') else ""
                
                response['reply'] = (
                    f"🎉 **Price Prediction**\n"
                    f"💰 Estimated Price: **{pred['price_display']['formatted']}** ({pred['price_display']['lacs']} Lacs)\n"
                    f"📊 Price Range: {pred['price_range']['min_display']['formatted']} - {pred['price_range']['max_display']['formatted']}\n"
                    f"🏷️ Segment: **{pred['segment']}** (detected via {pred['segment_method']})\n"
                    f"📍 City: {pred['car_info']['original_city'].title()}\n"
                    f"🚗 Car Age: {pred['car_info']['age']} years ({pred['car_info']['age_category']})\n"
                    f"✅ Confidence: {pred['model_performance']['confidence'].upper()}"
                    f"{warning_text}"
                )
                response['prediction'] = prediction_result
            else:
                response['reply'] = f"❌ Prediction failed: {prediction_result.get('error', 'Unknown')}"
        response['timestamp'] = datetime.now().isoformat()
        return jsonify(response)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": str(e),
            "reply": "Sorry, something went wrong. Please try again.",
            "timestamp": datetime.now().isoformat()
        }), 500

# ============================
# ERROR HANDLERS
# ============================
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# ============================
# START SERVER
# ============================
if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🚀 FLASK BACKEND STARTING...")
    print("=" * 60)
    success = load_models()
    if not success:
        print("⚠️ WARNING: Some models failed to load!")
    print("\n📍 Server running at: http://localhost:5000")
    print("📖 API Documentation: http://localhost:5000")
    print("\n💡 Test with:")
    print("   curl http://localhost:5000/api/health")
    print("\n" + "=" * 60 + "\n")
    app.run(debug=True, host="0.0.0.0", port=5000)