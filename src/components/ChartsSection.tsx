import React from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { useSavEarn } from '../context/SavEarnContext';
import { CATEGORIES } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartsSection: React.FC = () => {
  const { getDailyStats, getCategoryStats, getMonthlyStats } = useSavEarn();

  const dailyStats = getDailyStats().slice(-14); // Last 14 days
  const categoryStats = getCategoryStats();
  const monthlyStats = getMonthlyStats();

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
  };

  // Daily earnings chart data
  const dailyChartData = {
    labels: dailyStats.map(stat => new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Daily Earnings',
        data: dailyStats.map(stat => stat.totalEarned),
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Category distribution chart data
  const categoryChartData = {
    labels: categoryStats.map(stat => getCategoryInfo(stat.category).name),
    datasets: [
      {
        data: categoryStats.map(stat => stat.totalEarned),
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green
          '#F59E0B', // Amber
          '#EF4444', // Red
          '#8B5CF6', // Purple
          '#06B6D4', // Cyan
          '#6B7280', // Gray
        ],
        borderWidth: 0,
      },
    ],
  };

  // Monthly earnings chart data
  const monthlyChartData = {
    labels: monthlyStats.map(stat => stat.month),
    datasets: [
      {
        label: 'Monthly Earnings',
        data: monthlyStats.map(stat => stat.totalEarned),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#6B7280',
          callback: function(value: any) {
            return '₹' + value;
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = ((value / categoryStats.reduce((sum, stat) => sum + stat.totalEarned, 0)) * 100).toFixed(1);
            return `${label}: ₹${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Daily Earnings Trend */}
      <motion.div className="card" variants={itemVariants}>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Earnings Trend</h3>
        <div className="h-64">
          {dailyStats.length > 0 ? (
            <Line data={dailyChartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No data available
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <motion.div className="card" variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Earnings by Category</h3>
          <div className="h-64">
            {categoryStats.length > 0 ? (
              <Doughnut data={categoryChartData} options={doughnutOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available
              </div>
            )}
          </div>
        </motion.div>

        {/* Monthly Earnings */}
        <motion.div className="card" variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Earnings</h3>
          <div className="h-64">
            {monthlyStats.length > 0 ? (
              <Bar data={monthlyChartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Category Stats Table */}
      {categoryStats.length > 0 && (
        <motion.div className="card" variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Category</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">Total Earned</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">Entries</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">Avg/Entry</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map((stat) => {
                  const categoryInfo = getCategoryInfo(stat.category);
                  const avgPerEntry = stat.totalEarned / stat.count;
                  
                  return (
                    <tr key={stat.category} className="border-b border-gray-100">
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{categoryInfo.icon}</span>
                          <span className="font-medium text-gray-900">{categoryInfo.name}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-2 font-semibold text-earn-600">
                        ₹{stat.totalEarned.toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-2 text-gray-600">
                        {stat.count}
                      </td>
                      <td className="text-right py-3 px-2 text-gray-600">
                        ₹{avgPerEntry.toFixed(0)}
                      </td>
                      <td className="text-right py-3 px-2 text-gray-600">
                        {stat.percentage.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChartsSection;
