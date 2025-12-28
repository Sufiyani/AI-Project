// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Car, TrendingUp, Brain, Zap, CheckCircle, ArrowRight } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { getModelInfo } from '../services/api';

// const Home = () => {
//   const [modelInfo, setModelInfo] = useState(null);
  
//   useEffect(() => {
//     getModelInfo().then(setModelInfo).catch(console.error);
//   }, []);
  
//   const features = [
//     {
//       icon: Brain,
//       title: 'AI-Powered',
//       description: 'Random Forest algorithm with 94.65% accuracy',
//       color: 'from-blue-500 to-cyan-500',
//     },
//     {
//       icon: TrendingUp,
//       title: 'Market Analysis',
//       description: 'K-Means clustering for market segmentation',
//       color: 'from-purple-500 to-pink-500',
//     },
//     {
//       icon: Zap,
//       title: 'Instant Results',
//       description: 'Get price predictions in seconds',
//       color: 'from-orange-500 to-red-500',
//     },
//   ];
  
//   const stats = [
//     { label: 'Accuracy', value: modelInfo ? `${(modelInfo.accuracy * 100).toFixed(1)}%` : '94.7%' },
//     { label: 'Avg Error', value: modelInfo ? `±${(modelInfo.avg_error / 1000).toFixed(0)}k PKR` : '±186k' },
//     { label: 'Model', value: 'Random Forest' },
//   ];
  
//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden py-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
//                 AI-Powered
//                 <span className="gradient-text block">Car Price Predictor</span>
//               </h1>
              
//               <p className="text-xl text-gray-600 mb-8">
//                 Get instant, accurate car price predictions using advanced machine learning. 
//                 Trained on 5,000+ Pakistani car listings.
//               </p>
              
//               <div className="flex flex-wrap gap-4">
//                 <Link
//                   to="/predict"
//                   className="btn-primary inline-flex items-center space-x-2"
//                 >
//                   <span>Start Prediction</span>
//                   <ArrowRight className="w-5 h-5" />
//                 </Link>
                
//                 <Link
//                   to="/analytics"
//                   className="btn-secondary inline-flex items-center space-x-2"
//                 >
//                   <span>View Analytics</span>
//                   <TrendingUp className="w-5 h-5" />
//                 </Link>
//               </div>
              
//               {/* Stats */}
//               <div className="grid grid-cols-3 gap-4 mt-12">
//                 {stats.map((stat, idx) => (
//                   <motion.div
//                     key={stat.label}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: idx * 0.1 }}
//                     className="text-center"
//                   >
//                     <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
//                     <div className="text-sm text-gray-600">{stat.label}</div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
            
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//               className="relative"
//             >
//               <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-2xl">
//                 <Car className="w-64 h-64 mx-auto text-white opacity-20" />
                
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="bg-white rounded-2xl p-8 shadow-xl max-w-sm">
//                     <h3 className="text-xl font-bold text-gray-900 mb-4">
//                       Quick Preview
//                     </h3>
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-600">Brand</span>
//                         <span className="font-semibold">Honda Civic</span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-600">Year</span>
//                         <span className="font-semibold">2017</span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-gray-600">Mileage</span>
//                         <span className="font-semibold">60,000 km</span>
//                       </div>
//                       <div className="border-t pt-3">
//                         <div className="flex items-center justify-between">
//                           <span className="text-gray-600">Predicted Price</span>
//                           <span className="text-2xl font-bold text-blue-600">36.4L</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>
      
//       {/* Features Section */}
//       <section className="py-20 px-4 bg-white">
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">
//               Why Choose Our Predictor?
//             </h2>
//             <p className="text-xl text-gray-600">
//               Powered by cutting-edge machine learning technology
//             </p>
//           </motion.div>
          
//           <div className="grid md:grid-cols-3 gap-8">
//             {features.map((feature, idx) => {
//               const Icon = feature.icon;
//               return (
//                 <motion.div
//                   key={feature.title}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: idx * 0.1 }}
//                   className="card-hover bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
//                 >
//                   <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
//                     <Icon className="w-8 h-8 text-white" />
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-3">
//                     {feature.title}
//                   </h3>
//                   <p className="text-gray-600">
//                     {feature.description}
//                   </p>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       </section>
      
//       {/* How It Works */}
//       <section className="py-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">
//               How It Works
//             </h2>
//             <p className="text-xl text-gray-600">
//               Simple 3-step process to get your prediction
//             </p>
//           </motion.div>
          
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { step: '1', title: 'Enter Details', desc: 'Provide car information like brand, model, year, and mileage' },
//               { step: '2', title: 'AI Analysis', desc: 'Our Random Forest model analyzes 60+ features instantly' },
//               { step: '3', title: 'Get Results', desc: 'Receive accurate price prediction with confidence score' },
//             ].map((item, idx) => (
//               <motion.div
//                 key={item.step}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: idx * 0.1 }}
//                 className="text-center"
//               >
//                 <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
//                   {item.step}
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
//                 <p className="text-gray-600">{item.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>
      
//       {/* CTA Section */}
//       <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="max-w-4xl mx-auto text-center"
//         >
//           <h2 className="text-4xl font-bold text-white mb-6">
//             Ready to Predict Your Car's Price?
//           </h2>
//           <p className="text-xl text-blue-100 mb-8">
//             Join thousands of users who trust our AI-powered predictions
//           </p>
//           <Link
//             to="/predict"
//             className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
//           >
//             <span>Get Started Now</span>
//             <ArrowRight className="w-5 h-5" />
//           </Link>
//         </motion.div>
//       </section>
//     </div>
//   );
// };

// export default Home;


import React from 'react';
import { Sparkles, Calculator, Bot, TrendingUp, BarChart3 } from 'lucide-react';

const HomePage = ({ modelInfo, setCurrentPage, openChat }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">AI-Powered Predictions</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Predict Your Car's
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> True Value</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Get instant, accurate car price predictions powered by advanced machine learning. 
            Trained on 5,497+ real Pakistani car listings.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button
              onClick={() => setCurrentPage('predict')}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Calculator className="w-5 h-5" />
              Predict Price Now
            </button>
            <button
              onClick={openChat}
              className="flex items-center gap-2 px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-semibold hover:border-blue-600 transition-all"
            >
              <Bot className="w-5 h-5" />
              Chat with AI
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {modelInfo?.accuracy_r2 ? `${(modelInfo.accuracy_r2 * 100).toFixed(1)}%` : '94.2%'}
              </div>
              <div className="text-gray-600">Model Accuracy</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">5,497+</div>
              <div className="text-gray-600">Cars Analyzed</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">&lt;2 sec</div>
              <div className="text-gray-600">Prediction Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Predictor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">High Accuracy</h3>
              <p className="text-gray-600">Advanced Random Forest algorithm with polynomial features</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-4 bg-purple-100 rounded-full mb-4">
                <Bot className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Chatbot</h3>
              <p className="text-gray-600">Natural conversation to predict prices effortlessly</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Market Insights</h3>
              <p className="text-gray-600">Real-time analytics from Pakistani car market</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;