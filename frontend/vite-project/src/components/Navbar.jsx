// import { Link, useLocation } from 'react-router-dom';
// import { Car, BarChart3, Info, Sparkles } from 'lucide-react';
// import { motion } from 'framer-motion';

// const Navbar = () => {
//   const location = useLocation();
  
//   const isActive = (path) => location.pathname === path;
  
//   const navItems = [
//     { path: '/', label: 'Home', icon: Sparkles },
//     { path: '/predict', label: 'Predict', icon: Car },
//     { path: '/analytics', label: 'Analytics', icon: BarChart3 },
//     { path: '/about', label: 'About', icon: Info },
//   ];
  
//   return (
//     <motion.nav
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       className="bg-white shadow-lg sticky top-0 z-50"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-3">
//             <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
//               <Car className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-2xl font-bold gradient-text">
//               AI Car Predictor
//             </span>
//           </Link>
          
//           {/* Nav Links */}
//           <div className="hidden md:flex space-x-1">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
//                     isActive(item.path)
//                       ? 'bg-blue-600 text-white shadow-lg'
//                       : 'text-gray-600 hover:bg-blue-50'
//                   }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span className="font-medium">{item.label}</span>
//                 </Link>
//               );
//             })}
//           </div>
          
//           {/* Mobile Menu */}
//           <div className="md:hidden flex space-x-2">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className={`p-2 rounded-lg ${
//                     isActive(item.path)
//                       ? 'bg-blue-600 text-white'
//                       : 'text-gray-600 hover:bg-blue-50'
//                   }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </motion.nav>
//   );
// };

// export default Navbar;


import React, { useState } from 'react';
import { Menu, Car, Home, Calculator, BarChart3, Info, MessageCircle } from 'lucide-react';

const Navbar = ({ currentPage, setCurrentPage, openChat }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'predict', label: 'Predict Price', icon: Calculator },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'about', label: 'About', icon: Info }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <Car className="w-8 h-8" />
            <span className="text-xl font-bold">AI Car Predictor</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-white/20 font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            <button
              onClick={openChat}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Chat AI
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-white/20 font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                openChat();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Chat AI
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;