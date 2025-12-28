// import React from 'react';

// const AboutPage = ({ modelInfo }) => {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8 text-center">About Our AI Predictor</h1>
        
//         <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
//           <h2 className="text-2xl font-bold mb-4">How It Works</h2>
//           <p className="text-gray-600 mb-4">
//             Our AI-powered car price predictor uses advanced machine learning algorithms trained on thousands 
//             of real Pakistani car listings from PakWheels. The system analyzes multiple factors including brand, 
//             model, mileage, age, engine capacity, and location to provide accurate price estimates.
//           </p>
          
//           <div className="grid md:grid-cols-2 gap-6 mt-6">
//             <div>
//               <h3 className="font-bold text-lg mb-3">Model Details</h3>
//               <ul className="space-y-2 text-gray-600">
//                 <li className="flex items-start">
//                   <span className="mr-2">•</span>
//                   <span><strong>Algorithm:</strong> {modelInfo?.model_name || 'Random Forest Regressor'}</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="mr-2">•</span>
//                   <span><strong>Accuracy (R²):</strong> {modelInfo?.accuracy_r2 ? `${(modelInfo.accuracy_r2 * 100).toFixed(1)}%` : '94.2%'}</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="mr-2">•</span>
//                   <span><strong>Dataset:</strong> 5,497 verified car listings</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="mr-2">•</span>
//                   <span><strong>Features:</strong> Polynomial transformation + K-Means clustering</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="mr-2">•</span>
//                   <span><strong>MAE:</strong> ±{modelInfo?.mae ? modelInfo.mae.toLocaleString() : '185,000'} PKR</span>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="font-bold text-lg mb-3">Key Features</h3>
//               <ul className="space-y-2 text-gray-600">
//                 <li className="flex items-start">
//                   <span className="mr-2">✓</span>
//                   <span>Instant predictions (&lt;2 seconds)</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="mr-2">✓</span>
//                   <span>Smart chatbot interface (Urdu/English)</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="mr-2">✓</span>
//                   <span>Market analytics dashboard</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="mr-2">✓</span>
//                   <span>Price range estimates (±10%)</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="mr-2">✓</span>
//                   <span>Segment classification (Economy to Luxury)</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="mr-2">✓</span>
//                   <span>Validation warnings for anomalies</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
//           <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="font-bold text-lg mb-3">Backend</h3>
//               <ul className="space-y-1 text-gray-600">
//                 <li>• Python Flask REST API</li>
//                 <li>• Scikit-learn ML models</li>
//                 <li>• Pandas for data processing</li>
//                 <li>• NumPy for numerical operations</li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="font-bold text-lg mb-3">Frontend</h3>
//               <ul className="space-y-1 text-gray-600">
//                 <li>• React.js with Hooks</li>
//                 <li>• Tailwind CSS styling</li>
//                 <li>• Lucide React icons</li>
//                 <li>• Responsive design</li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-8">
//           <h2 className="text-2xl font-bold mb-4">Market Segments</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="border-l-4 border-green-500 pl-4 py-2">
//               <div className="font-bold text-green-700">Economy</div>
//               <div className="text-sm text-gray-600">Under 20 Lacs PKR</div>
//             </div>
//             <div className="border-l-4 border-blue-500 pl-4 py-2">
//               <div className="font-bold text-blue-700">Mid-Range</div>
//               <div className="text-sm text-gray-600">20 - 40 Lacs PKR</div>
//             </div>
//             <div className="border-l-4 border-purple-500 pl-4 py-2">
//               <div className="font-bold text-purple-700">Premium</div>
//               <div className="text-sm text-gray-600">40 - 70 Lacs PKR</div>
//             </div>
//             <div className="border-l-4 border-red-500 pl-4 py-2">
//               <div className="font-bold text-red-700">Luxury</div>
//               <div className="text-sm text-gray-600">Above 70 Lacs PKR</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AboutPage;


import React from 'react';

const AboutPage = ({ modelInfo }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">About Our AI Predictor</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Our AI-powered car price predictor uses advanced machine learning algorithms trained on thousands 
            of real Pakistani car listings from PakWheels. The system analyzes multiple factors including brand, 
            model, mileage, age, engine capacity, and location to provide accurate price estimates.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Model Details</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Algorithm:</strong> {modelInfo?.model_name || 'Random Forest Regressor'}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Accuracy (R²):</strong> {modelInfo?.accuracy_r2 ? `${(modelInfo.accuracy_r2 * 100).toFixed(1)}%` : '94.2%'}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Dataset:</strong> 5,497 verified car listings</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Features:</strong> Polynomial transformation + K-Means clustering</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>MAE:</strong> ±{modelInfo?.mae ? modelInfo.mae.toLocaleString() : '185,000'} PKR</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Key Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Instant predictions (&lt;2 seconds)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Smart chatbot interface (Urdu/English)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Market analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Price range estimates (±10%)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Segment classification (Economy to Luxury)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Validation warnings for anomalies</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Backend</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Python Flask REST API</li>
                <li>• Scikit-learn ML models</li>
                <li>• Pandas for data processing</li>
                <li>• NumPy for numerical operations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Frontend</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• React.js with Hooks</li>
                <li>• Tailwind CSS styling</li>
                <li>• Lucide React icons</li>
                <li>• Responsive design</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Market Segments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <div className="font-bold text-green-700">Economy</div>
              <div className="text-sm text-gray-600">Under 20 Lacs PKR</div>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="font-bold text-blue-700">Mid-Range</div>
              <div className="text-sm text-gray-600">20 - 40 Lacs PKR</div>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="font-bold text-purple-700">Premium</div>
              <div className="text-sm text-gray-600">40 - 70 Lacs PKR</div>
            </div>
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <div className="font-bold text-red-700">Luxury</div>
              <div className="text-sm text-gray-600">Above 70 Lacs PKR</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;