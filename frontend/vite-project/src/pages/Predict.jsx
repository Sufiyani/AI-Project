// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import PredictionForm from '../components/PredictionForm';
// import ResultCard from '../components/ResultCard';
// import Chatbot from '../components/Chatbot';

// const Predict = () => {
//   const [result, setResult] = useState(null);
  
//   return (
//     <div className="min-h-screen py-12 px-4">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-12"
//         >
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Predict Your <span className="gradient-text">Car Price</span>
//           </h1>
//           <p className="text-xl text-gray-600">
//             Enter your car details below to get an instant AI-powered price prediction
//           </p>
//         </motion.div>
        
//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Form */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="bg-white rounded-2xl shadow-xl p-8"
//           >
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">
//               Car Information
//             </h2>
//             <PredictionForm onPredictionComplete={setResult} />
//           </motion.div>
          
//           {/* Result */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//           >
//             {result ? (
//               <ResultCard result={result} />
//             ) : (
//               <div className="bg-gray-50 rounded-2xl p-12 text-center h-full flex items-center justify-center">
//                 <div>
//                   <div className="text-6xl mb-4">🚗</div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">
//                     Ready to Predict
//                   </h3>
//                   <p className="text-gray-600">
//                     Fill the form and click predict to see results here
//                   </p>
//                 </div>
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </div>
      
//       {/* Chatbot */}
//       <Chatbot />
//     </div>
//   );
// };

// export default Predict;


// import React, { useState, useEffect } from 'react';
// import { Loader, Calculator } from 'lucide-react';
// import { fetchFeatureOptions, predictPrice } from '../services/api';

// const PredictPage = ({ showToast }) => {
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [featureOptions, setFeatureOptions] = useState(null);
//   const [formData, setFormData] = useState({
//     car_brand: '',
//     car_model: '',
//     city: '',
//     fuel_type: '',
//     engine: '',
//     transmission: '',
//     registered_in: '',
//     mileage: ''
//   });

//   useEffect(() => {
//     fetchFeatureOptions()
//       .then(data => setFeatureOptions(data.options))
//       .catch(err => showToast('Failed to load options', 'error'));
//   }, [showToast]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setResult(null);

//     try {
//       const data = await predictPrice(formData);
      
//       if (data.success) {
//         setResult(data);
//         showToast('Price predicted successfully!', 'success');
//       } else {
//         showToast(data.error || 'Prediction failed', 'error');
//       }
//     } catch (error) {
//       showToast('Network error. Please try again.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!featureOptions) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader className="w-8 h-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8 text-center">Car Price Prediction</h1>
        
//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Form */}
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Car Brand</label>
//                 <select
//                   required
//                   value={formData.car_brand}
//                   onChange={(e) => setFormData({...formData, car_brand: e.target.value})}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select Brand</option>
//                   {featureOptions.car_brand?.map(brand => (
//                     <option key={brand} value={brand}>{brand.toUpperCase()}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Car Model</label>
//                 <select
//                   required
//                   value={formData.car_model}
//                   onChange={(e) => setFormData({...formData, car_model: e.target.value})}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select Model</option>
//                   {featureOptions.car_model?.map(model => (
//                     <option key={model} value={model}>{model.toUpperCase()}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">City</label>
//                 <select
//                   required
//                   value={formData.city}
//                   onChange={(e) => setFormData({...formData, city: e.target.value})}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select City</option>
//                   {featureOptions.city?.map(city => (
//                     <option key={city} value={city}>{city.toUpperCase()}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Fuel Type</label>
//                 <select
//                   required
//                   value={formData.fuel_type}
//                   onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select Fuel Type</option>
//                   {featureOptions.fuel_type?.map(fuel => (
//                     <option key={fuel} value={fuel}>{fuel.toUpperCase()}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Engine (cc)</label>
//                 <input
//                   type="number"
//                   required
//                   value={formData.engine}
//                   onChange={(e) => setFormData({...formData, engine: e.target.value})}
//                   placeholder="e.g., 1300"
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Transmission</label>
//                 <select
//                   required
//                   value={formData.transmission}
//                   onChange={(e) => setFormData({...formData, transmission: e.target.value})}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select Transmission</option>
//                   {featureOptions.transmission?.map(trans => (
//                     <option key={trans} value={trans}>{trans.toUpperCase()}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Registration Year</label>
//                 <input
//                   type="number"
//                   required
//                   value={formData.registered_in}
//                   onChange={(e) => setFormData({...formData, registered_in: e.target.value})}
//                   placeholder="e.g., 2018"
//                   min="1990"
//                   max="2025"
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Mileage (km)</label>
//                 <input
//                   type="number"
//                   required
//                   value={formData.mileage}
//                   onChange={(e) => setFormData({...formData, mileage: e.target.value})}
//                   placeholder="e.g., 50000"
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <Loader className="w-5 h-5 animate-spin" />
//                     Predicting...
//                   </span>
//                 ) : (
//                   'Predict Price'
//                 )}
//               </button>
//             </form>
//           </div>

//           {/* Result */}
//           <div>
//             {result ? (
//               <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
//                 <h2 className="text-2xl font-bold mb-4">Prediction Result</h2>
                
//                 <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
//                   <div className="text-sm opacity-90 mb-1">Estimated Price</div>
//                   <div className="text-4xl font-bold">{result.price_display.formatted}</div>
//                   <div className="text-sm opacity-90 mt-1">{result.price_display.lacs} Lacs</div>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span>Price Range:</span>
//                     <span className="font-semibold">
//                       {result.price_range.min_display.lacs} - {result.price_range.max_display.lacs} Lacs
//                     </span>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <span>Segment:</span>
//                     <span className="font-semibold">{result.segment}</span>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <span>Car Age:</span>
//                     <span className="font-semibold">{result.car_info.age} years ({result.car_info.age_category})</span>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <span>Confidence:</span>
//                     <span className="font-semibold uppercase">{result.model_performance.confidence}</span>
//                   </div>
//                 </div>

//                 {result.warnings && result.warnings.length > 0 && (
//                   <div className="mt-4 bg-yellow-500/20 rounded-lg p-3">
//                     <div className="font-semibold mb-2">⚠️ Warnings:</div>
//                     {result.warnings.map((w, i) => (
//                       <div key={i} className="text-sm">{w}</div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="bg-gray-100 rounded-xl p-8 text-center text-gray-500">
//                 <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
//                 <p>Fill the form and click "Predict Price" to see results</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PredictPage;


import React, { useState, useEffect } from 'react';
import { Loader, Calculator } from 'lucide-react';

const PredictPage = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [featureOptions, setFeatureOptions] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [formData, setFormData] = useState({
    car_brand: '',
    car_model: '',
    city: '',
    fuel_type: '',
    engine: '',
    transmission: '',
    registered_in: '',
    mileage: ''
  });

  useEffect(() => {
    let mounted = true;
    
    const fetchOptions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/feature-options');
        const data = await response.json();
        
        if (mounted) {
          setFeatureOptions(data.options);
          setLoadingOptions(false);
        }
      } catch (err) {
        if (mounted) {
          setLoadingOptions(false);
          showToast('Failed to load options', 'error');
        }
      }
    };
    
    fetchOptions();
    
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async () => {
    // Validate all fields are filled
    if (!formData.car_brand || !formData.car_model || !formData.city || 
        !formData.fuel_type || !formData.engine || !formData.transmission || 
        !formData.registered_in || !formData.mileage) {
      showToast('Please fill all fields', 'error');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Convert numeric fields to integers
      const submissionData = {
        ...formData,
        engine: parseInt(formData.engine),
        registered_in: parseInt(formData.registered_in),
        mileage: parseInt(formData.mileage)
      };

      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        showToast('Price predicted successfully!', 'success');
      } else {
        showToast(data.error || 'Prediction failed', 'error');
      }
    } catch (error) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!featureOptions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Failed to load form options</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Car Price Prediction</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Car Brand</label>
                <select
                  value={formData.car_brand}
                  onChange={(e) => setFormData({...formData, car_brand: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Brand</option>
                  {featureOptions.car_brand?.map(brand => (
                    <option key={brand} value={brand}>{brand.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Car Model</label>
                <select
                  value={formData.car_model}
                  onChange={(e) => setFormData({...formData, car_model: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Model</option>
                  {featureOptions.car_model?.map(model => (
                    <option key={model} value={model}>{model.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="Enter city (e.g., Karachi, Lahore, Islamabad)"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Enter any city in Pakistan</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fuel Type</label>
                <select
                  value={formData.fuel_type}
                  onChange={(e) => setFormData({...formData, fuel_type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Fuel Type</option>
                  {featureOptions.fuel_type?.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Engine (cc)</label>
                <input
                  type="number"
                  value={formData.engine}
                  onChange={(e) => setFormData({...formData, engine: e.target.value})}
                  placeholder="e.g., 1300"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({...formData, transmission: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Transmission</option>
                  {featureOptions.transmission?.map(trans => (
                    <option key={trans} value={trans}>{trans.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Registration Year</label>
                <input
                  type="number"
                  value={formData.registered_in}
                  onChange={(e) => setFormData({...formData, registered_in: e.target.value})}
                  placeholder="e.g., 2018"
                  min="1990"
                  max="2025"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mileage (km)</label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                  placeholder="e.g., 50000"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Predicting...
                  </span>
                ) : (
                  'Predict Price'
                )}
              </button>
            </div>
          </div>

          {/* Result */}
          <div>
            {result ? (
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-4">Prediction Result</h2>
                
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
                  <div className="text-sm opacity-90 mb-1">Estimated Price</div>
                  <div className="text-4xl font-bold">{result.price_display.formatted}</div>
                  <div className="text-sm opacity-90 mt-1">{result.price_display.lacs} Lacs</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Price Range:</span>
                    <span className="font-semibold">
                      {result.price_range.min_display.lacs} - {result.price_range.max_display.lacs} Lacs
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Segment:</span>
                    <span className="font-semibold">{result.segment}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Car Age:</span>
                    <span className="font-semibold">{result.car_info.age} years ({result.car_info.age_category})</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Confidence:</span>
                    <span className="font-semibold uppercase">{result.model_performance.confidence}</span>
                  </div>
                </div>

                {result.warnings && result.warnings.length > 0 && (
                  <div className="mt-4 bg-yellow-500/20 rounded-lg p-3">
                    <div className="font-semibold mb-2">⚠️ Warnings:</div>
                    {result.warnings.map((w, i) => (
                      <div key={i} className="text-sm">{w}</div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-xl p-8 text-center text-gray-500">
                <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Fill the form and click "Predict Price" to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictPage;