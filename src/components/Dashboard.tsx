import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Calendar, Award, Plus, BarChart3, PiggyBank } from 'lucide-react';
import { useSavEarn } from '../context/SavEarnContext';
import AddEntryModal from './AddEntryModal';
import StatsCards from './StatsCards';
import RecentEntries from './RecentEntries';
import ChartsSection from './ChartsSection';

const Dashboard: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const { state, getTodayEarnings, getThisMonthEarnings } = useSavEarn();

  const todayEarnings = getTodayEarnings();
  const monthEarnings = getThisMonthEarnings();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-xl">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient">SavEarn</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-earn-100 px-4 py-2 rounded-full">
                <TrendingUp className="h-4 w-4 text-earn-600" />
                <span className="text-sm font-semibold text-earn-800">
                  ₹{state.totalEarned.toLocaleString()} Total Earned
                </span>
              </div>
              
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Earning</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            You've Earned{' '}
            <span className="earning-gradient">₹{state.totalEarned.toLocaleString()}</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Every smart choice is money in your pocket. Keep earning!
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div 
              className="glass-card p-4 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Calendar className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">₹{todayEarnings}</div>
              <div className="text-sm text-gray-600">Today</div>
            </motion.div>
            
            <motion.div 
              className="glass-card p-4 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Target className="h-6 w-6 text-success-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">₹{monthEarnings}</div>
              <div className="text-sm text-gray-600">This Month</div>
            </motion.div>
            
            <motion.div 
              className="glass-card p-4 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Award className="h-6 w-6 text-earn-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{state.currentStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </motion.div>
            
            <motion.div 
              className="glass-card p-4 text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <BarChart3 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{state.totalEntries}</div>
              <div className="text-sm text-gray-600">Smart Choices</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex justify-center mb-8"
          variants={itemVariants}
        >
          <div className="bg-white p-2 rounded-2xl shadow-lg">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Analytics
            </button>
          </div>
        </motion.div>

        {/* Content based on active tab */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' ? (
            <div className="space-y-8">
              <StatsCards />
              <RecentEntries />
            </div>
          ) : (
            <ChartsSection />
          )}
        </motion.div>
      </div>

      {/* Add Entry Modal */}
      <AddEntryModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </motion.div>
  );
};

export default Dashboard;
