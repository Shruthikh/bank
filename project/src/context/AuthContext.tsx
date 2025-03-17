import React, { createContext, useContext, useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean }>;
  logout: () => void;
  deposit: (amount: number, description: string) => void;
  withdraw: (amount: number, description: string) => void;
  transfer: (amount: number, recipient: string) => void;
  transactions: Transaction[];
  error: string | null;
  clearError: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  balance: number;
  loginTime: string | null;
  lastActivity: string;
  accountType: 'savings' | 'checking';
  accountNumber: string;
  rewardPoints: number;
  transactions: Transaction[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated user database
const USERS_KEY = 'bank_users';
const TRANSACTIONS_KEY = 'bank_transactions';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load saved state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    const savedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const generateAccountNumber = () => {
    return Math.random().toString().slice(2, 12);
  };

  const clearError = () => setError(null);

  const updateBalance = (amount: number) => {
    if (user) {
      const newUser = {
        ...user,
        balance: user.balance + amount,
        lastActivity: new Date().toISOString(),
        rewardPoints: user.rewardPoints + Math.floor(Math.abs(amount))
      };
      setUser(newUser);
      localStorage.setItem('current_user', JSON.stringify(newUser));
    }
  };

  const addTransaction = (type: 'credit' | 'debit', amount: number, description: string) => {
    const newTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      description,
      date: new Date().toLocaleString()
    };
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
  };

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const user = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('No account found with this email. Please register first.');
      }

      if (user.password !== password) {
        throw new Error('Incorrect password. Please try again.');
      }

      // Create authenticated user object without sensitive data
      const authenticatedUser = {
        ...user,
        loginTime: new Date().toLocaleString(),
        lastActivity: new Date().toLocaleString(),
      };
      delete authenticatedUser.password; // Remove password from session data

      setUser(authenticatedUser);
      setIsAuthenticated(true);
      localStorage.setItem('current_user', JSON.stringify(authenticatedUser));
      
      // Load user's transactions
      const userTransactions = JSON.parse(localStorage.getItem(`${user.id}_transactions`) || '[]');
      setTransactions(userTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setError(null);
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password length
      if (password.length <= 5) {
        throw new Error('Password must be more than 5 characters');
      }

      const existingUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const userExists = existingUsers.some((user: User) => user.email.toLowerCase() === email.toLowerCase());

      if (userExists) {
        throw new Error('An account already exists with this email');
      }

      const newUser = {
        id: Date.now().toString(),
        email: email.toLowerCase(), // Store email in lowercase
        password,
        name,
        balance: 0,
        transactions: [],
        accountType: 'savings' as const,
        accountNumber: generateAccountNumber(),
        rewardPoints: 0,
        lastActivity: new Date().toISOString(),
        loginTime: null
      };

      localStorage.setItem(USERS_KEY, JSON.stringify([...existingUsers, newUser]));
      
      // Initialize empty transactions array for the new user
      localStorage.setItem(`${newUser.id}_transactions`, JSON.stringify([]));
      
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setTransactions([]);
    localStorage.removeItem('current_user');
  };

  const deposit = (amount: number, description: string) => {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }
    updateBalance(amount);
    addTransaction('credit', amount, description);
  };

  const withdraw = (amount: number, description: string) => {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }
    if (!user || user.balance < amount) {
      throw new Error('Insufficient balance');
    }
    updateBalance(-amount);
    addTransaction('debit', amount, description);
  };

  const transfer = (amount: number, recipient: string) => {
    if (amount <= 0) {
      throw new Error('Transfer amount must be positive');
    }
    if (!user || user.balance < amount) {
      throw new Error('Insufficient balance');
    }
    updateBalance(-amount);
    addTransaction('debit', amount, `Transfer to ${recipient}`);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register, 
      logout,
      deposit,
      withdraw,
      transfer,
      transactions,
      error,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};