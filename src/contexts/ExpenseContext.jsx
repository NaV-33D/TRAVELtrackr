
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Food & Dining', icon: 'utensils', color: 'bg-orange-500' },
    { id: 2, name: 'Transportation', icon: 'car', color: 'bg-blue-500' },
    { id: 3, name: 'Shopping', icon: 'shopping-bag', color: 'bg-pink-500' },
    { id: 4, name: 'Entertainment', icon: 'film', color: 'bg-purple-500' },
    { id: 5, name: 'Housing', icon: 'home', color: 'bg-green-500' },
    { id: 6, name: 'Utilities', icon: 'plug', color: 'bg-yellow-500' },
    { id: 7, name: 'Healthcare', icon: 'heart', color: 'bg-red-500' },
    { id: 8, name: 'Travel', icon: 'plane', color: 'bg-indigo-500' }
  ]);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedCategories = localStorage.getItem('categories');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now(),
      ...expense,
      date: expense.date || new Date().toISOString().split('T')[0]
    };
    
    setExpenses([newExpense, ...expenses]);
    toast({
      title: "Expense added",
      description: `$${expense.amount} for ${expense.description}`,
    });
  };

  const updateExpense = (id, updatedExpense) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    ));
    toast({
      title: "Expense updated",
      description: "Your expense has been updated successfully",
    });
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast({
      title: "Expense deleted",
      description: "Your expense has been removed",
      variant: "destructive",
    });
  };

  const addCategory = (category) => {
    const newCategory = {
      id: Date.now(),
      ...category
    };
    setCategories([...categories, newCategory]);
    toast({
      title: "Category added",
      description: `${category.name} has been added to categories`,
    });
  };

  const updateCategory = (id, updatedCategory) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, ...updatedCategory } : category
    ));
    toast({
      title: "Category updated",
      description: "Your category has been updated successfully",
    });
  };

  const deleteCategory = (id) => {
    // Check if category is in use
    const inUse = expenses.some(expense => expense.categoryId === id);
    
    if (inUse) {
      toast({
        title: "Cannot delete category",
        description: "This category is being used by existing expenses",
        variant: "destructive",
      });
      return false;
    }
    
    setCategories(categories.filter(category => category.id !== id));
    toast({
      title: "Category deleted",
      description: "Your category has been removed",
      variant: "destructive",
    });
    return true;
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + Number(expense.amount), 0);
  };

  const getExpensesByCategory = () => {
    const result = {};
    categories.forEach(category => {
      result[category.id] = {
        ...category,
        total: 0,
        count: 0
      };
    });

    expenses.forEach(expense => {
      if (result[expense.categoryId]) {
        result[expense.categoryId].total += Number(expense.amount);
        result[expense.categoryId].count += 1;
      }
    });

    return Object.values(result);
  };

  const getRecentExpenses = (limit = 5) => {
    return [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  const getExpensesByDateRange = (startDate, endDate) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    });
  };

  const getCategoryById = (id) => {
    return categories.find(category => category.id === id) || null;
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      categories,
      addExpense,
      updateExpense,
      deleteExpense,
      addCategory,
      updateCategory,
      deleteCategory,
      getTotalExpenses,
      getExpensesByCategory,
      getRecentExpenses,
      getExpensesByDateRange,
      getCategoryById
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
