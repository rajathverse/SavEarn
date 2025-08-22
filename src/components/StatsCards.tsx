import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Calendar, Award, Trophy, Zap } from 'lucide-react';
import { useSavEarn } from '../context/SavEarnContext';

const StatsCards: React.FC = () => {
  const { state, getTodayEarnings, getThisMonthEarnings } = useSavEarn();

  const todayEarnings = getTodayEarnings();
  const monthEarnings = getThisMonthEarnings();
  const avgPerEntry = state.totalEntries > 0 ? state.totalEarned / state.totalEntries : 0;

  const stats = [
    {
      title: "Today's Earnings",
      value: `₹${todayEarnings.toLocaleString()}`,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: todayEarnings > 0 ? '+' + todayEarnings : '0',
    },
    {
      title: "This Month",
      value: `₹${monthEarnings.toLocaleString()}`,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      change: `${state.totalEntries} entries`,
    },
    {
      title: "Current Streak",
      value: `${state.currentStreak} days`,
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      change: `Best: ${state.bestStreak} days`,
    },
    {
      title: "Avg per Choice",
      value: `₹${avgPerEntry.toFixed(0)}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      change: `${state.totalEntries} total`,
    },
  ];

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
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          className={`card border-l-4 ${stat.borderColor} hover:shadow-2xl transform hover:-translate-y-1`}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-xl`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCards;
