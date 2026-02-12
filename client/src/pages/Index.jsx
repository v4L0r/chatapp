import React from 'react';
import { Link } from "react-router-dom";
import { LogIn, UserPlus, MessageSquare, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Index() {
  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="h-full w-full bg-gray-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4"
          >
            Welcome to <span className="text-emerald-600">ChatApp</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Connect with friends, manage your account, or administer the platform. 
            Select an option below to get started.
          </motion.p>
        </div>

        {/* Navigation Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Login Card */}
          <Link to="/login" className="group">
            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-emerald-500 transition-all duration-300 h-full flex flex-col items-start"
            >
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <LogIn size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Login</h2>
              <p className="text-gray-500 mb-6 flex-1">
                Already have an account? Sign in to access your messages and profile.
              </p>
              <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                Sign In <ArrowRight size={16} className="ml-2" />
              </div>
            </motion.div>
          </Link>

          {/* Register Card */}
          <Link to="/register" className="group">
            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-emerald-500 transition-all duration-300 h-full flex flex-col items-start"
            >
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <UserPlus size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Register</h2>
              <p className="text-gray-500 mb-6 flex-1">
                New here? Create an account to start chatting with the community.
              </p>
              <div className="flex items-center text-emerald-600 font-medium group-hover:translate-x-1 transition-transform">
                Create Account <ArrowRight size={16} className="ml-2" />
              </div>
            </motion.div>
          </Link>

          {/* Chat Card */}
          <Link to="/chat" className="group">
            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-emerald-500 transition-all duration-300 h-full flex flex-col items-start"
            >
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <MessageSquare size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Open Chat</h2>
              <p className="text-gray-500 mb-6 flex-1">
                Jump straight into the conversation. (Requires login)
              </p>
              <div className="flex items-center text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
                Launch Chat <ArrowRight size={16} className="ml-2" />
              </div>
            </motion.div>
          </Link>

          {/* Admin Card */}
          <Link to="/admin" className="group">
            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-emerald-500 transition-all duration-300 h-full flex flex-col items-start"
            >
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Shield size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Panel</h2>
              <p className="text-gray-500 mb-6 flex-1">
                Manage users and system settings. (Restricted access)
              </p>
              <div className="flex items-center text-orange-600 font-medium group-hover:translate-x-1 transition-transform">
                Go to Dashboard <ArrowRight size={16} className="ml-2" />
              </div>
            </motion.div>
          </Link>

        </motion.div>
      </div>
    </div>
  );
}