
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  PieChart as PieChartIcon,
  TrendingUp,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExpenses } from '@/contexts/ExpenseContext';
import { format, subMonths, addMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const Reports = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    expenses, 
    categories, 
    getExpensesByCategory,
    getCategoryById
  } = useExpenses();

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Get start and end dates for the current month
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

  // Filter expenses for the current month
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return isWithinInterval(expenseDate, { start: startDate, end: endDate });
  });

  // Calculate total for the current month
  const currentMonthTotal = currentMonthExpenses.reduce(
    (total, expense) => total + Number(expense.amount), 
    0
  );

  // Prepare data for category distribution chart
  const categoryData = getExpensesByCategory()
    .filter(cat => cat.total > 0)
    .map(cat => ({
      name: cat.name,
      value: cat.total,
      color: cat.color.replace('bg-', '')
    }));

  // Color mapping for charts
  const COLORS = {
    'orange-500': '#f97316',
    'blue-500': '#3b82f6',
    'pink-500': '#ec4899',
    'purple-500': '#a855f7',
    'green-500': '#22c55e',
    'yellow-500': '#eab308',
    'red-500': '#ef4444',
    'indigo-500': '#6366f1'
  };

  // Prepare data for daily spending chart
  const getDailySpendingData = () => {
    const dailyData = {};
    
    currentMonthExpenses.forEach(expense => {
      const day = expense.date.split('-')[2]; // Extract day from YYYY-MM-DD
      if (!dailyData[day]) {
        dailyData[day] = 0;
      }
      dailyData[day] += Number(expense.amount);
    });
    
    // Convert to array and sort by day
    return Object.entries(dailyData)
      .map(([day, amount]) => ({ day: parseInt(day), amount }))
      .sort((a, b) => a.day - b.day);
  };

  // Prepare data for category comparison chart
  const getCategoryComparisonData = () => {
    const categoryTotals = {};
    
    categories.forEach(category => {
      categoryTotals[category.id] = {
        name: category.name,
        color: category.color.replace('bg-', ''),
        amount: 0
      };
    });
    
    currentMonthExpenses.forEach(expense => {
      if (categoryTotals[expense.categoryId]) {
        categoryTotals[expense.categoryId].amount += Number(expense.amount);
      }
    });
    
    return Object.values(categoryTotals)
      .filter(cat => cat.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  };

  // Get top expenses for the current month
  const getTopExpenses = (limit = 5) => {
    return [...currentMonthExpenses]
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, limit);
  };

  const dailySpendingData = getDailySpendingData();
  const categoryComparisonData = getCategoryComparisonData();
  const topExpenses = getTopExpenses();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Expense Reports
        </motion.h1>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center bg-white px-3 py-2 rounded-md shadow-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span className="font-medium">{format(currentDate, 'MMMM yyyy')}</span>
          </div>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Monthly Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Monthly Overview</h2>
            <p className="text-gray-500">{format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-blue-600 font-medium">Total Expenses</p>
            <h3 className="text-2xl font-bold mt-1">${currentMonthTotal.toFixed(2)}</h3>
            <p className="text-sm text-blue-600 mt-2">
              {currentMonthExpenses.length} transactions
            </p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-green-600 font-medium">Average Daily</p>
            <h3 className="text-2xl font-bold mt-1">
              ${(currentMonthTotal / (dailySpendingData.length || 1)).toFixed(2)}
            </h3>
            <p className="text-sm text-green-600 mt-2">
              {dailySpendingData.length} days with expenses
            </p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-purple-600 font-medium">Top Category</p>
            {categoryComparisonData.length > 0 ? (
              <>
                <h3 className="text-2xl font-bold mt-1">{categoryComparisonData[0].name}</h3>
                <p className="text-sm text-purple-600 mt-2">
                  ${categoryComparisonData[0].amount.toFixed(2)} ({Math.round((categoryComparisonData[0].amount / currentMonthTotal) * 100)}%)
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold mt-1">No data</h3>
                <p className="text-sm text-purple-600 mt-2">Add expenses to see stats</p>
              </>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Daily Trend
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="h-80">
              {categoryComparisonData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryComparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                    <Bar dataKey="amount" name="Amount">
                      {categoryComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.color] || '#8884d8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>No expense data to display for this month</p>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Top Expenses This Month</h3>
              {topExpenses.length > 0 ? (
                <div className="space-y-4">
                  {topExpenses.map((expense) => {
                    const category = getCategoryById(expense.categoryId);
                    return (
                      <div key={expense.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          {category && (
                            <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center text-white mr-3`}>
                              <span className="text-sm">{category.name.charAt(0)}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(expense.date), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold">${Number(expense.amount).toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No expenses recorded this month</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.color] || '#8884d8'} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>No category data to display</p>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
                {categoryComparisonData.length > 0 ? (
                  <div className="space-y-4">
                    {categoryComparisonData.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full bg-${category.color} mr-2`}></div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <span className="font-semibold">${category.amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-${category.color} h-2 rounded-full`} 
                            style={{ width: `${(category.amount / currentMonthTotal) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 text-right">
                          {Math.round((category.amount / currentMonthTotal) * 100)}% of total
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">No category data to display</p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends">
            <div className="h-80">
              {dailySpendingData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailySpendingData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#3b82f6" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>No daily spending data to display for this month</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Daily Spending Insights</h3>
              
              {dailySpendingData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-gray-500 text-sm">Highest Spending Day</p>
                    {(() => {
                      const highest = [...dailySpendingData].sort((a, b) => b.amount - a.amount)[0];
                      return (
                        <div className="mt-2">
                          <p className="text-xl font-bold">${highest.amount.toFixed(2)}</p>
                          <p className="text-sm text-blue-600">Day {highest.day}</p>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-gray-500 text-sm">Average Daily Spending</p>
                    <p className="text-xl font-bold mt-2">
                      ${(dailySpendingData.reduce((sum, day) => sum + day.amount, 0) / dailySpendingData.length).toFixed(2)}
                    </p>
                    <p className="text-sm text-green-600">{dailySpendingData.length} days with expenses</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-gray-500 text-sm">Spending Frequency</p>
                    <p className="text-xl font-bold mt-2">
                      {Math.round((dailySpendingData.length / endDate.getDate()) * 100)}%
                    </p>
                    <p className="text-sm text-purple-600">of days this month</p>
                  </div>
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No daily spending data to display</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Reports;
