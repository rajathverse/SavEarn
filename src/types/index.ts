export interface SavingEntry {
  id: string;
  date: string;
  category: string;
  expensiveOption: string;
  expensiveAmount: number;
  chosenOption: string;
  chosenAmount: number;
  earned: number;
  description?: string;
}

export interface DailyStats {
  date: string;
  totalEarned: number;
  entriesCount: number;
}

export interface CategoryStats {
  category: string;
  totalEarned: number;
  count: number;
  percentage: number;
}

export interface MonthlyStats {
  month: string;
  totalEarned: number;
  entriesCount: number;
}

export const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍽️' },
  { id: 'transport', name: 'Transportation', icon: '🚗' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '✨' },
  { id: 'health', name: 'Health & Fitness', icon: '💪' },
  { id: 'other', name: 'Other', icon: '📦' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];
