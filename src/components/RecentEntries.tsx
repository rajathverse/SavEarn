import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, TrendingUp } from 'lucide-react';
import { useSavEarn } from '../context/SavEarnContext';
import { CATEGORIES } from '../types';
import { format, parseISO } from 'date-fns';

const RecentEntries: React.FC = () => {
  const { state, deleteEntry } = useSavEarn();

  const recentEntries = [...state.entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
  };

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today';
    } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM dd');
    }
  };

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
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (recentEntries.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 mb-4">
          <TrendingUp className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No earnings yet</h3>
        <p className="text-gray-500">Start making smart choices and watch your earnings grow!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Earnings</h2>
        <div className="text-sm text-gray-500">Last 5 entries</div>
      </div>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {recentEntries.map((entry) => {
          const categoryInfo = getCategoryInfo(entry.category);
          
          return (
            <motion.div
              key={entry.id}
              className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-200"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-2xl">{categoryInfo.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-600">
                        {formatDate(entry.date)}
                      </span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                        {categoryInfo.name}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-800 mb-2">
                      <span className="font-medium">Instead of:</span> {entry.expensiveOption} (₹{entry.expensiveAmount})
                    </div>
                    
                    <div className="text-sm text-gray-800 mb-2">
                      <span className="font-medium">You chose:</span> {entry.chosenOption} (₹{entry.chosenAmount})
                    </div>
                    
                    {entry.description && (
                      <div className="text-xs text-gray-600 italic">
                        {entry.description}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 ml-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-earn-600">
                      +₹{entry.earned}
                    </div>
                    <div className="text-xs text-gray-500">earned</div>
                  </div>
                  
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {state.entries.length > 5 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Showing {recentEntries.length} of {state.entries.length} total entries
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentEntries;
