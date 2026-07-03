import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, roles } from '../../context/AuthContext';
import { LogIn, Mail, Lock, CookingPot } from 'lucide-react';
import { motion } from 'framer-motion';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      let role = roles.ADMIN;
      if (email.includes('manager')) role = roles.MANAGER;
      else if (email.includes('customer')) role = roles.CUSTOMER;

      login(role);
      setLoading(false);

      switch (role) {
        case roles.ADMIN: navigate('/admin/dashboard'); break;
        case roles.MANAGER: navigate('/manager/dashboard'); break;
        case roles.CUSTOMER: navigate('/customer/home'); break;
        default: navigate('/dashboard');
      }
    }, 1000);
  };

  const handleDemoLogin = (role) => {
    const roleEmails = {
      ADMIN: 'admin@lumierevillas.com',
      MANAGER: 'manager@lumierevillas.com',
      CUSTOMER: 'customer@lumierevillas.com'
    };
    
    setEmail(roleEmails[role] || `${role.toLowerCase()}@lumierevillas.com`);
    setPassword('password123');
  };

  return (
    <div className="h-screen w-full bg-black flex items-start md:items-center justify-center p-4 py-8 md:py-12 relative overflow-y-auto overflow-x-hidden scrollbar-hide">
      {/* Background Image Layer (Faint) */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center grayscale scale-110 fixed"
        style={{ backgroundImage: `url('/luxury-villa-hero.png')` }}
      />

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-6xl bg-black/80 border border-white/10 rounded-[40px] flex flex-col md:flex-row overflow-hidden shadow-2xl backdrop-blur-sm"
      >
        {/* Left Side: Branding & Full-Section Hero Image */}
        <div className="flex-1 relative overflow-hidden group min-h-[400px] md:min-h-full">
          {/* Hero Image covering full section */}
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
            src="/luxury-villa-hero.png"
            alt="Food Hero"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Dark Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 z-10" />

          {/* Overlay Content (Logo & Footer) */}
          <div className="relative z-20 h-full flex flex-col justify-between p-8 md:p-12">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-1.5 shadow-xl shadow-black/20">
                  <img src="/1000464407-removebg-preview.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-3xl font-black tracking-tighter text-white drop-shadow-2xl uppercase">
                LUMIÈRE <span className="text-primary">VILLAS</span>
                </span>
              </div>
            </div>

            <div>
              <p className="text-white/80 text-sm font-bold tracking-widest uppercase drop-shadow-md">Premium Dining Experience</p>
              <div className="w-12 h-1 bg-primary mt-3 rounded-full shadow-lg shadow-primary/50"></div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form Section */}
        <div className="w-full md:w-[420px] p-8 md:pl-6 md:pr-14 flex flex-col justify-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 shadow-lg shadow-black/10">
                <img src="/1000464407-removebg-preview.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black tracking-tight text-white uppercase">
                LUMIÈRE <span className="text-primary">VILLAS</span>
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@gmail.com"
                className="w-full px-5 py-2.5 bg-white rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-[#FF4D1C] outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-5 py-2.5 bg-white rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-[#FF4D1C] outline-none transition-all"
                required
              />
              <div className="text-right mt-1">
                <button type="button" className="text-xs text-gray-500 hover:text-white transition-colors">Forgot Password?</button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Simulation Portals</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.keys(roles).map((role) => (
              <button
                key={role}
                onClick={() => handleDemoLogin(role)}
                className="px-4 py-3 bg-[#1a1a1a] border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-primary/50 hover:text-white hover:bg-primary/5 transition-all flex flex-col items-center gap-1"
              >
                <span className="text-white/80">{role}</span>
                <span className="text-[8px] text-gray-600 font-medium">Access Portal</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
