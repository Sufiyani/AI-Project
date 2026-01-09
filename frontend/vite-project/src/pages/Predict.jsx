import React, { useState, useEffect, useRef } from 'react';
import { Loader, Calculator, Car, MapPin, Fuel, Gauge, Settings, Calendar, TrendingUp, AlertCircle, Download, Activity, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const PredictPage = ({ showToast }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [trendStats, setTrendStats] = useState(null);
  const [trendMeta, setTrendMeta] = useState(null);
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [featureOptions, setFeatureOptions] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const reportRef = useRef(null);

  const [formData, setFormData] = useState({
    car_brand: '', car_model: '', city: '', fuel_type: '',
    engine: '', transmission: '', registered_in: '', mileage: ''
  });

  const calculateProgress = () => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(f => f !== '').length;
    return (filledFields / fields.length) * 100;
  };

  // ✅ ULTIMATE PDF GENERATION - Using pure jsPDF (most reliable)
  const generatePDF = async () => {
    if (!result) return;

    showToast('Generating certificate...', 'info');
    setLoading(true);

    try {
      const { jsPDF } = await import('jspdf');
      
      // ✅ Create PDF (A4 size)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let y = 20; // Starting Y position

      // ✅ Background color
      pdf.setFillColor(15, 23, 42); // #0f172a
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // ✅ HEADER - AutoAI Predictor
      pdf.setTextColor(59, 130, 246); // Blue
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AUTOAI PREDICTOR', pageWidth / 2, y, { align: 'center' });
      
      y += 8;
      pdf.setTextColor(100, 116, 139); // Slate
      pdf.setFontSize(9);
      pdf.text('OFFICIAL AI VALUATION CERTIFICATE V2.0', pageWidth / 2, y, { align: 'center' });
      
      y += 5;
      pdf.setFontSize(8);
      pdf.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth / 2, y, { align: 'center' });

      // ✅ Divider
      y += 8;
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(0.5);
      pdf.line(20, y, pageWidth - 20, y);

      // ✅ WATERMARK - CERTIFIED
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(80);
      pdf.setFont('helvetica', 'bold');
      pdf.saveGraphicsState();
      pdf.setGState(new pdf.GState({ opacity: 0.03 }));
      const watermarkText = 'CERTIFIED';
      const textWidth = pdf.getTextWidth(watermarkText);
      pdf.text(watermarkText, (pageWidth - textWidth) / 2, pageHeight / 2, { 
        angle: -25 
      });
      pdf.restoreGraphicsState();

      // ✅ PRICE - Big Display
      y += 35;
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(42);
      pdf.setFont('helvetica', 'bold');
      pdf.text(result.price_display.formatted, pageWidth / 2, y, { align: 'center' });
      
      y += 12;
      pdf.setTextColor(16, 185, 129); // Emerald
      pdf.setFontSize(20);
      pdf.text(`${result.price_display.lacs} Lacs PKR`, pageWidth / 2, y, { align: 'center' });
      
      y += 8;
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(10);
      pdf.text('Estimated Market Value', pageWidth / 2, y, { align: 'center' });

      // ✅ CAR DETAILS SECTION
      y += 20;
      
      // Function to draw card
      const drawCard = (x, y, w, h, label, value) => {
        pdf.setFillColor(30, 41, 59);
        pdf.setDrawColor(255, 255, 255);
        pdf.setLineWidth(0.1);
        pdf.roundedRect(x, y, w, h, 3, 3, 'FD');
        
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text(label.toUpperCase(), x + w / 2, y + 5, { align: 'center' });
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(value.toString().toUpperCase(), x + w / 2, y + 11, { align: 'center' });
      };

      // Draw 2x2 grid
      const cardWidth = 85;
      const cardHeight = 15;
      const spacing = 10;
      const startX = 20;

      drawCard(startX, y, cardWidth, cardHeight, 'Brand', formData.car_brand);
      drawCard(startX + cardWidth + spacing, y, cardWidth, cardHeight, 'Model', formData.car_model);
      
      y += cardHeight + spacing;
      drawCard(startX, y, cardWidth, cardHeight, 'Registration Year', formData.registered_in);
      drawCard(startX + cardWidth + spacing, y, cardWidth, cardHeight, 'Mileage', `${Number(formData.mileage).toLocaleString()} KM`);

      // ✅ SPECIFICATIONS SECTION
      y += 25;
      pdf.setFillColor(30, 41, 59);
      pdf.roundedRect(20, y, pageWidth - 40, 30, 3, 3, 'F');
      
      y += 7;
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ADDITIONAL SPECIFICATIONS', 25, y);
      
      y += 8;
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const specs = [
        `Engine: ${formData.engine} CC`,
        `Transmission: ${formData.transmission}`,
        `Fuel Type: ${formData.fuel_type}`,
        `City: ${formData.city}`
      ];
      
      specs.forEach((spec, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        pdf.text(spec, 25 + (col * 85), y + (row * 7));
      });

      // ✅ MARKET ANALYSIS (if trend data available)
      if (trendStats) {
        y += 25;
        pdf.setFillColor(30, 41, 59);
        pdf.roundedRect(20, y, pageWidth - 40, 30, 3, 3, 'F');
        
        y += 7;
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('MARKET ANALYSIS', 25, y);
        
        y += 10;
        pdf.setFontSize(10);
        
        // Three columns
        const colWidth = 55;
        let x = 30;
        
        // Purchase Price
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(8);
        pdf.text('Purchase Price', x, y);
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${(trendStats.price_at_purchase / 100000).toFixed(2)}L`, x, y + 6);
        
        // Value Change
        x += colWidth;
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(trendStats.is_appreciating ? 'Value Gain' : 'Value Loss', x, y);
        pdf.setTextColor(trendStats.is_appreciating ? 16 : 239, trendStats.is_appreciating ? 185 : 68, trendStats.is_appreciating ? 129 : 68);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${trendStats.is_appreciating ? '+' : ''}${(trendStats.total_value_change / 100000).toFixed(2)}L`, x, y + 6);
        
        // Change Rate
        x += colWidth;
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Change Rate', x, y);
        pdf.setTextColor(trendStats.is_appreciating ? 16 : 251, trendStats.is_appreciating ? 185 : 191, trendStats.is_appreciating ? 129 : 36);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${trendStats.is_appreciating ? '+' : ''}${Math.abs(trendStats.value_change_percentage).toFixed(1)}%`, x, y + 6);
      }

      // ✅ VERIFICATION BADGE
      y = trendStats ? y + 20 : y + 35;
      pdf.setFillColor(59, 130, 246);
      pdf.setDrawColor(59, 130, 246);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(20, y, pageWidth - 40, 20, 3, 3, 'FD');
      
      y += 7;
      pdf.setTextColor(59, 130, 246);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('✓ AI-POWERED VALUATION', pageWidth / 2, y, { align: 'center' });
      
      y += 6;
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`This certificate is generated using advanced ML algorithms. Accuracy: ${(result.model_performance.accuracy_r2 * 100).toFixed(1)}%`, pageWidth / 2, y, { align: 'center' });

      // ✅ FOOTER
      y = pageHeight - 20;
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(0.5);
      pdf.line(20, y, pageWidth - 20, y);
      
      y += 5;
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(8);
      pdf.text('VERIFIED BY AUTOAI ENGINE', 25, y);
      pdf.text(`Certificate ID: ${Date.now().toString(36).toUpperCase()}`, pageWidth - 25, y, { align: 'right' });

      // ✅ Save PDF
      const filename = `AutoAI_${formData.car_brand}_${formData.car_model}_${formData.registered_in}.pdf`;
      pdf.save(filename);
      
      showToast('Certificate downloaded! 🎉', 'success');
    } catch (error) {
      console.error('PDF Error:', error);
      showToast(`Generation failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

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
          showToast('Failed to sync options', 'error');
        }
      }
    };
    fetchOptions();
    return () => { mounted = false; };
  }, []);

  const fetchTrendData = async (predictedPrice) => {
    setLoadingTrend(true);
    try {
      const response = await fetch('http://localhost:5000/api/price-trend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car_brand: formData.car_brand,
          car_model: formData.car_model,
          fuel_type: formData.fuel_type,
          transmission: formData.transmission,
          engine: parseInt(formData.engine),
          mileage: parseInt(formData.mileage),
          registered_in: parseInt(formData.registered_in),
          predicted_price: predictedPrice
        })
      });
      const data = await response.json();
      
      if (data.success) {
        const chartData = data.trend_data.years.map((year, idx) => ({
          year: year.toString(),
          price: data.trend_data.prices[idx],
          isCurrentYear: year === data.trend_data.current_year
        }));
        setTrendData(chartData);
        setTrendStats(data.statistics);
        setTrendMeta(data.metadata);
        
        showToast(`Trend loaded (${data.metadata.reliability} confidence)`, 'success');
      } else {
        showToast('Could not load price trend', 'error');
      }
    } catch (error) {
      console.error('Trend fetch error:', error);
      showToast('Trend data unavailable', 'error');
    } finally {
      setLoadingTrend(false);
    }
  };

  const handleSubmit = async () => {
    if (Object.values(formData).some(val => val === '')) {
      showToast('All parameters required for analysis', 'error');
      return;
    }
    setLoading(true);
    setResult(null);
    setTrendData(null);
    setTrendStats(null);
    setTrendMeta(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          engine: parseInt(formData.engine),
          registered_in: parseInt(formData.registered_in),
          mileage: parseInt(formData.mileage)
        })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data);
        showToast('AI valuation generated!', 'success');
        await fetchTrendData(data.predicted_price);
      }
    } catch (error) {
      showToast('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-white/20 rounded-xl p-4 shadow-2xl">
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
            Year {payload[0].payload.year}
          </p>
          <p className="text-lg font-black text-white">
            PKR {(payload[0].value / 100000).toFixed(2)} Lacs
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {payload[0].value.toLocaleString()} PKR
          </p>
          {payload[0].payload.isCurrentYear && (
            <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Current Value
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const TrendIcon = () => {
    if (!trendStats) return <Minus className="w-4 h-4" />;
    if (trendStats.trend_direction === 'increasing') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (trendStats.trend_direction === 'decreasing') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-slate-500" />;
  };

  if (loadingOptions) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-500 text-xs font-black tracking-[0.3em]">SYNCHRONIZING MODELS</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pt-28 pb-20 selection:bg-blue-500/30">
      <style>{`
        .glass-input { background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255, 255, 255, 0.05); }
        .glass-input:focus { border-color: #3b82f6; background: rgba(30, 41, 59, 0.6); outline: none; }
        .prediction-card { background: linear-gradient(160deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95)); border: 1px solid rgba(255, 255, 255, 0.05); }
        .watermark-text { 
           position: absolute; top: 50%; left: 50%; 
           transform: translate(-50%, -50%) rotate(-25deg);
           font-size: 8rem; font-weight: 900; color: white; opacity: 0.02;
           pointer-events: none; white-space: nowrap; z-index: 0;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        .reliability-badge {
          font-size: 9px;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .reliability-high { background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981; }
        .reliability-medium { background: rgba(251, 191, 36, 0.2); color: #fbbf24; border: 1px solid #fbbf24; }
        .reliability-low { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444; }
      `}</style>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
           <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">AI <span className="text-blue-500">Predictor</span></h1>
           <p className="text-slate-500 font-medium">Neural valuation engine for Pakistani automotive market.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 shadow-inner">
               <div className="flex justify-between items-end mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Analysis Readiness</span>
                  <span className="text-blue-500 font-bold text-sm">{Math.round(calculateProgress())}%</span>
               </div>
               <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700 shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
                    style={{ width: `${calculateProgress()}%` }}
                  />
               </div>
            </div>

            <div className="prediction-card p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                <FormSelect icon={<Car/>} label="Brand" value={formData.car_brand} onChange={(e) => setFormData({...formData, car_brand: e.target.value, car_model: ''})} options={featureOptions.car_brand} />
                <FormSelect icon={<Settings/>} label="Model" value={formData.car_model} onChange={(e) => setFormData({...formData, car_model: e.target.value})} options={featureOptions.car_model} disabled={!formData.car_brand} />
                <FormInput icon={<MapPin/>} label="City" value={formData.city} placeholder="City Name" onChange={(e) => setFormData({...formData, city: e.target.value})} />
                <FormSelect icon={<Fuel/>} label="Fuel" value={formData.fuel_type} onChange={(e) => setFormData({...formData, fuel_type: e.target.value})} options={featureOptions.fuel_type} />
                <FormInput icon={<Gauge/>} label="Engine" type="number" value={formData.engine} placeholder="CC e.g. 1300" onChange={(e) => setFormData({...formData, engine: e.target.value})} />
                <FormSelect icon={<TrendingUp/>} label="Gear" value={formData.transmission} onChange={(e) => setFormData({...formData, transmission: e.target.value})} options={featureOptions.transmission} />
                <FormInput icon={<Calendar/>} label="Year" type="number" value={formData.registered_in} placeholder="Registration Year" onChange={(e) => setFormData({...formData, registered_in: e.target.value})} />
                <FormInput icon={<TrendingUp/>} label="ODO" type="number" value={formData.mileage} placeholder="Total KM" onChange={(e) => setFormData({...formData, mileage: e.target.value})} />
              </div>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-900/40 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader className="animate-spin"/> : "Generate AI Valuation"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            {result ? (
              <div className="sticky top-28 space-y-6">
                <div ref={reportRef} className="space-y-6">
                  <div className="prediction-card p-10 rounded-[2.5rem] relative overflow-hidden bg-[#0f172a] animate-fade-in-up">
                    <div className="watermark-text tracking-widest">CERTIFIED</div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10 border-b border-white/10 pb-6">
                          <div>
                              <div className="text-blue-500 font-black text-xl italic tracking-tighter">AUTOAI <span className="text-white not-italic">PREDICTOR</span></div>
                              <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black">Official Verification v2.0</div>
                          </div>
                          <div className="text-right text-[10px] font-bold text-slate-400">
                             {new Date().toLocaleDateString()}
                          </div>
                      </div>

                      <div className="mb-10">
                        <div className="text-6xl font-black text-white tracking-tighter mb-1">{result.price_display.formatted}</div>
                        <div className="text-xl font-bold text-emerald-500 tracking-tight">{result.price_display.lacs} Lacs PKR</div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-8">
                        <ReportDetail label="Brand" value={formData.car_brand}/>
                        <ReportDetail label="Variant" value={formData.car_model}/>
                        <ReportDetail label="Mileage" value={`${Number(formData.mileage).toLocaleString()} KM`}/>
                        <ReportDetail label="Year" value={formData.registered_in}/>
                      </div>

                      <div className="pt-6 border-t border-white/10 flex justify-between items-center text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
                         <span>Market Accuracy</span>
                         <span className="text-emerald-500">Verified by AutoAI</span>
                      </div>
                    </div>
                  </div>

                  <div className="prediction-card p-8 rounded-[2.5rem] relative overflow-hidden animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-blue-500" />
                        <div>
                          <h3 className="text-lg font-black text-white">Market History</h3>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            {formData.car_brand} {formData.car_model} • Yearly Analysis
                          </p>
                        </div>
                      </div>
                      {trendMeta && (
                        <div className={`reliability-badge reliability-${trendMeta.reliability}`}>
                          {trendMeta.reliability}
                        </div>
                      )}
                    </div>

                    {loadingTrend ? (
                      <div className="h-64 flex flex-col items-center justify-center gap-3">
                        <Loader className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-xs text-slate-500 font-bold">Analyzing market data...</p>
                      </div>
                    ) : trendData ? (
                      <>
                        <div className="h-64 mb-6">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <defs>
                                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                              <XAxis 
                                dataKey="year" 
                                stroke="#64748b"
                                style={{ fontSize: '11px', fontWeight: 'bold' }}
                                tick={{ fill: '#64748b' }}
                              />
                              <YAxis 
                                stroke="#64748b"
                                style={{ fontSize: '11px', fontWeight: 'bold' }}
                                tick={{ fill: '#64748b' }}
                                tickFormatter={(value) => `${(value / 100000).toFixed(1)}L`}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Area 
                                type="monotone" 
                                dataKey="price" 
                                stroke="#3b82f6" 
                                strokeWidth={3}
                                fill="url(#priceGradient)"
                                dot={(props) => {
                                  const { cx, cy, payload } = props;
                                  return payload.isCurrentYear ? (
                                    <circle cx={cx} cy={cy} r={6} fill="#10b981" stroke="#fff" strokeWidth={2} />
                                  ) : (
                                    <circle cx={cx} cy={cy} r={4} fill="#3b82f6" />
                                  );
                                }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        {trendStats && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Purchase Price</span>
                                  <TrendIcon />
                                </div>
                                <div className="text-lg font-black text-white">
                                  {(trendStats.price_at_purchase / 100000).toFixed(2)}L
                                </div>
                              </div>
                              
                              <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                                <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider mb-2">
                                  {trendStats.is_appreciating ? "Value Gain" : "Value Loss"}
                                </div>
                                <div className={`text-lg font-black ${trendStats.is_appreciating ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {trendStats.is_appreciating ? '+' : ''}{(trendStats.total_value_change / 100000).toFixed(2)}L
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                              <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider mb-2">
                                {trendStats.trend_label === 'appreciation' ? 'Appreciation Rate' : trendStats.trend_label === 'depreciation' ? 'Depreciation Rate' : 'Market Status'}
                              </div>
                              <div className="flex items-baseline gap-2">
                                <div className={`text-2xl font-black ${trendStats.is_appreciating ? 'text-emerald-400' : 'text-orange-400'}`}>
                                  {trendStats.is_appreciating ? '+' : ''}{Math.abs(trendStats.value_change_percentage).toFixed(1)}%
                                </div>
                                <div className="text-xs text-slate-500 font-bold">
                                  ({trendStats.is_appreciating ? '+' : ''}{Math.abs(trendStats.avg_change_per_year / 100000).toFixed(2)}L/year)
                                </div>
                              </div>
                            </div>

                            {trendStats.is_appreciating && (
                              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-2">
                                  <TrendingUp className="w-3 h-3" />
                                  Pakistani market inflation effect: Car value increased!
                                </p>
                              </div>
                            )}

                            {trendMeta && trendMeta.data_source === 'real_market_data' && (
                              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-2">
                                  <Activity className="w-3 h-3" />
                                  Based on {trendMeta.matching_cars_found} similar cars in market
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-slate-600">
                        <p className="text-sm">Trend data unavailable</p>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={generatePDF}
                  disabled={loading}
                  className="w-full py-5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white rounded-3xl font-black transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-5 h-5 text-blue-500" />
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'DOWNLOAD FULL CERTIFICATE'}
                </button>
              </div>
            ) : (
              <div className="sticky top-28 h-[550px] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center">
                 <Calculator className="w-12 h-12 text-slate-800 mb-4" />
                 <h3 className="text-slate-400 font-bold">Waiting for Specs</h3>
                 <p className="text-slate-600 text-xs mt-2">Fill the form to unlock AI valuation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportDetail = ({ label, value }) => (
  <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-center">
    <div className="text-[8px] uppercase text-slate-500 font-black mb-1 tracking-widest">{label}</div>
    <div className="text-[11px] font-black text-white uppercase truncate">{value}</div>
  </div>
);

const FormInput = ({ icon, label, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.15em]">{icon} {label}</label>
    <input className="w-full px-6 py-4 glass-input rounded-2xl text-white placeholder:text-slate-700 font-bold text-sm transition-all" {...props} />
  </div>
);

const FormSelect = ({ icon, label, options, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.15em]">{icon} {label}</label>
    <select className="w-full px-6 py-4 glass-input rounded-2xl text-white appearance-none cursor-pointer font-bold text-sm transition-all" {...props}>
      <option value="">Choose {label}</option>
      {options?.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
    </select>
  </div>
);

export default PredictPage;