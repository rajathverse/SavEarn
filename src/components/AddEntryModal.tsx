import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, TrendingUp } from 'lucide-react';
import { useSavEarn } from '../context/SavEarnContext';
import { CATEGORIES } from '../types';
import { format } from 'date-fns';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose }) => {
  const { addEntry } = useSavEarn();
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    category: '',
    expensiveOption: '',
    expensiveAmount: '',
    chosenOption: '',
    chosenAmount: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        category: '',
        expensiveOption: '',
        expensiveAmount: '',
        chosenOption: '',
        chosenAmount: '',
        description: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.expensiveOption.trim()) newErrors.expensiveOption = 'Please enter the expensive option';
    if (!formData.expensiveAmount || isNaN(Number(formData.expensiveAmount)) || Number(formData.expensiveAmount) <= 0) {
      newErrors.expensiveAmount = 'Please enter a valid amount';
    }
    if (!formData.chosenOption.trim()) newErrors.chosenOption = 'Please enter your chosen option';
    if (!formData.chosenAmount || isNaN(Number(formData.chosenAmount)) || Number(formData.chosenAmount) < 0) {
      newErrors.chosenAmount = 'Please enter a valid amount';
    }
    
    const expensiveAmt = Number(formData.expensiveAmount);
    const chosenAmt = Number(formData.chosenAmount);
    
    if (chosenAmt >= expensiveAmt) {
      newErrors.chosenAmount = 'Chosen amount should be less than expensive option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    addEntry({
      date: formData.date,
      category: formData.category,
      expensiveOption: formData.expensiveOption.trim(),
      expensiveAmount: Number(formData.expensiveAmount),
      chosenOption: formData.chosenOption.trim(),
      chosenAmount: Number(formData.chosenAmount),
      description: formData.description.trim() || undefined,
    });

    onClose();
  };

  const earned = Number(formData.expensiveAmount) - Number(formData.chosenAmount);
  const showEarned = !isNaN(earned) && earned > 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-success-500 to-success-600 p-2 rounded-xl">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Add New Earning</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 ${
                  errors.category ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Expensive Option */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expensive Option
              </label>
              <input
                type="text"
                value={formData.expensiveOption}
                onChange={(e) => setFormData({ ...formData, expensiveOption: e.target.value })}
                placeholder="e.g., Burger from restaurant"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 ${
                  errors.expensiveOption ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.expensiveOption && (
                <p className="mt-1 text-sm text-red-600">{errors.expensiveOption}</p>
              )}
            </div>

            {/* Expensive Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expensive Amount (₹)
              </label>
              <input
                type="number"
                value={formData.expensiveAmount}
                onChange={(e) => setFormData({ ...formData, expensiveAmount: e.target.value })}
                placeholder="300"
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 ${
                  errors.expensiveAmount ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.expensiveAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.expensiveAmount}</p>
              )}
            </div>

            {/* Chosen Option */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What You Chose Instead
              </label>
              <input
                type="text"
                value={formData.chosenOption}
                onChange={(e) => setFormData({ ...formData, chosenOption: e.target.value })}
                placeholder="e.g., Pakoda from local vendor"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 ${
                  errors.chosenOption ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.chosenOption && (
                <p className="mt-1 text-sm text-red-600">{errors.chosenOption}</p>
              )}
            </div>

            {/* Chosen Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount Spent (₹)
              </label>
              <input
                type="number"
                value={formData.chosenAmount}
                onChange={(e) => setFormData({ ...formData, chosenAmount: e.target.value })}
                placeholder="40"
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 ${
                  errors.chosenAmount ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.chosenAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.chosenAmount}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add any notes about this smart choice..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
              />
            </div>

            {/* Earnings Preview */}
            {showEarned && (
              <motion.div
                className="bg-gradient-to-r from-earn-50 to-earn-100 border border-earn-200 rounded-xl p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-earn-600" />
                  <span className="text-sm font-medium text-earn-800">You'll earn:</span>
                </div>
                <div className="text-2xl font-bold text-earn-900 mt-1">
                  ₹{earned.toLocaleString()}
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-success flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Earning</span>
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddEntryModal;
