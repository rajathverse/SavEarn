import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { SavingEntry, DailyStats, CategoryStats, MonthlyStats } from '../types';
import { format, parseISO, startOfMonth, isSameMonth } from 'date-fns';

interface SavEarnState {
  entries: SavingEntry[];
  totalEarned: number;
  currentStreak: number;
  bestStreak: number;
  totalEntries: number;
}

type SavEarnAction =
  | { type: 'ADD_ENTRY'; payload: SavingEntry }
  | { type: 'DELETE_ENTRY'; payload: string }
  | { type: 'LOAD_DATA'; payload: SavEarnState }
  | { type: 'CLEAR_DATA' };

interface SavEarnContextType {
  state: SavEarnState;
  addEntry: (entry: Omit<SavingEntry, 'id' | 'earned'>) => void;
  deleteEntry: (id: string) => void;
  clearAllData: () => void;
  getDailyStats: () => DailyStats[];
  getCategoryStats: () => CategoryStats[];
  getMonthlyStats: () => MonthlyStats[];
  getTodayEarnings: () => number;
  getThisMonthEarnings: () => number;
}

const SavEarnContext = createContext<SavEarnContextType | undefined>(undefined);

const initialState: SavEarnState = {
  entries: [],
  totalEarned: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalEntries: 0,
};

function calculateStreak(entries: SavingEntry[]): { current: number; best: number } {
  if (entries.length === 0) return { current: 0, best: 0 };

  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const yesterdayStr = format(new Date(today.getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

  // Group entries by date
  const entriesByDate = sortedEntries.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, SavingEntry[]>);

  const dates = Object.keys(entriesByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Calculate current streak
  let currentStreak = 0;
  const hasToday = entriesByDate[todayStr];
  const hasYesterday = entriesByDate[yesterdayStr];

  if (hasToday) {
    currentStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i-1]);
      const prevDate = new Date(dates[i]);
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else if (hasYesterday) {
    currentStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      if (dates[i] === yesterdayStr) continue;
      const currentDate = new Date(dates[i-1]);
      const prevDate = new Date(dates[i]);
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate best streak
  let bestStreak = 0;
  let tempStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const currentDate = new Date(dates[i-1]);
    const prevDate = new Date(dates[i]);
    const diffTime = currentDate.getTime() - prevDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      tempStreak++;
    } else {
      bestStreak = Math.max(bestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  bestStreak = Math.max(bestStreak, tempStreak);

  return { current: currentStreak, best: bestStreak };
}

function savEarnReducer(state: SavEarnState, action: SavEarnAction): SavEarnState {
  switch (action.type) {
    case 'ADD_ENTRY': {
      const newEntry = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        earned: action.payload.expensiveAmount - action.payload.chosenAmount,
      };
      
      const newEntries = [...state.entries, newEntry];
      const streaks = calculateStreak(newEntries);
      
      return {
        ...state,
        entries: newEntries,
        totalEarned: state.totalEarned + newEntry.earned,
        totalEntries: state.totalEntries + 1,
        currentStreak: streaks.current,
        bestStreak: Math.max(state.bestStreak, streaks.best),
      };
    }
    
    case 'DELETE_ENTRY': {
      const entryToDelete = state.entries.find(e => e.id === action.payload);
      if (!entryToDelete) return state;
      
      const newEntries = state.entries.filter(e => e.id !== action.payload);
      const streaks = calculateStreak(newEntries);
      
      return {
        ...state,
        entries: newEntries,
        totalEarned: state.totalEarned - entryToDelete.earned,
        totalEntries: state.totalEntries - 1,
        currentStreak: streaks.current,
        bestStreak: streaks.best,
      };
    }
    
    case 'LOAD_DATA':
      return action.payload;
    
    case 'CLEAR_DATA':
      return initialState;
    
    default:
      return state;
  }
}

const STORAGE_KEY = 'savearn-data';

export function SavEarnProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(savEarnReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addEntry = (entry: Omit<SavingEntry, 'id' | 'earned'>) => {
    dispatch({ type: 'ADD_ENTRY', payload: entry as SavingEntry });
  };

  const deleteEntry = (id: string) => {
    dispatch({ type: 'DELETE_ENTRY', payload: id });
  };

  const clearAllData = () => {
    dispatch({ type: 'CLEAR_DATA' });
    localStorage.removeItem(STORAGE_KEY);
  };

  const getDailyStats = (): DailyStats[] => {
    const statsMap = new Map<string, DailyStats>();
    
    state.entries.forEach(entry => {
      const date = entry.date;
      if (statsMap.has(date)) {
        const existing = statsMap.get(date)!;
        statsMap.set(date, {
          ...existing,
          totalEarned: existing.totalEarned + entry.earned,
          entriesCount: existing.entriesCount + 1,
        });
      } else {
        statsMap.set(date, {
          date,
          totalEarned: entry.earned,
          entriesCount: 1,
        });
      }
    });

    return Array.from(statsMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getCategoryStats = (): CategoryStats[] => {
    const statsMap = new Map<string, { totalEarned: number; count: number }>();
    
    state.entries.forEach(entry => {
      if (statsMap.has(entry.category)) {
        const existing = statsMap.get(entry.category)!;
        statsMap.set(entry.category, {
          totalEarned: existing.totalEarned + entry.earned,
          count: existing.count + 1,
        });
      } else {
        statsMap.set(entry.category, {
          totalEarned: entry.earned,
          count: 1,
        });
      }
    });

    const total = state.totalEarned;
    return Array.from(statsMap.entries()).map(([category, stats]) => ({
      category,
      totalEarned: stats.totalEarned,
      count: stats.count,
      percentage: total > 0 ? (stats.totalEarned / total) * 100 : 0,
    })).sort((a, b) => b.totalEarned - a.totalEarned);
  };

  const getMonthlyStats = (): MonthlyStats[] => {
    const statsMap = new Map<string, MonthlyStats>();
    
    state.entries.forEach(entry => {
      const monthKey = format(parseISO(entry.date), 'yyyy-MM');
      const monthLabel = format(parseISO(entry.date), 'MMM yyyy');
      
      if (statsMap.has(monthKey)) {
        const existing = statsMap.get(monthKey)!;
        statsMap.set(monthKey, {
          ...existing,
          totalEarned: existing.totalEarned + entry.earned,
          entriesCount: existing.entriesCount + 1,
        });
      } else {
        statsMap.set(monthKey, {
          month: monthLabel,
          totalEarned: entry.earned,
          entriesCount: 1,
        });
      }
    });

    return Array.from(statsMap.values()).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  };

  const getTodayEarnings = (): number => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return state.entries
      .filter(entry => entry.date === today)
      .reduce((sum, entry) => sum + entry.earned, 0);
  };

  const getThisMonthEarnings = (): number => {
    const now = new Date();
    return state.entries
      .filter(entry => isSameMonth(parseISO(entry.date), now))
      .reduce((sum, entry) => sum + entry.earned, 0);
  };

  const value: SavEarnContextType = {
    state,
    addEntry,
    deleteEntry,
    clearAllData,
    getDailyStats,
    getCategoryStats,
    getMonthlyStats,
    getTodayEarnings,
    getThisMonthEarnings,
  };

  return (
    <SavEarnContext.Provider value={value}>
      {children}
    </SavEarnContext.Provider>
  );
}

export function useSavEarn() {
  const context = useContext(SavEarnContext);
  if (context === undefined) {
    throw new Error('useSavEarn must be used within a SavEarnProvider');
  }
  return context;
}
