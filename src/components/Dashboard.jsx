import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  PieChart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExpenses } from "@/contexts/ExpenseContext";
import ExpenseForm from "@/components/ExpenseForm";
import { format } from "date-fns";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const {
    getTotalExpenses,
    getExpensesByCategory,
    getRecentExpenses,
    getCategoryById,
  } = useExpenses();

  const totalExpenses = getTotalExpenses();
  const expensesByCategory = getExpensesByCategory();
  const recentExpenses = getRecentExpenses(5);

  // Prepare data for pie chart
  const pieChartData = expensesByCategory
    .filter((cat) => cat.total > 0)
    .map((cat) => ({
      name: cat.name,
      value: cat.total,
      color: cat.color.replace("bg-", ""),
    }));

  // Color mapping for pie chart
  const COLORS = {
    "orange-500": "#f97316",
    "blue-500": "#3b82f6",
    "pink-500": "#ec4899",
    "purple-500": "#a855f7",
    "green-500": "#22c55e",
    "yellow-500": "#eab308",
    "red-500": "#ef4444",
    "indigo-500": "#6366f1",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        className="hero-gradient rounded-2xl p-8 text-white shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Track Your Expenses with Ease
          </h1>
          <p className="text-lg opacity-90 mb-6">
            Get a clear view of your spending habits and take control of your
            finances
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => setShowExpenseForm(true)}
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-black hover:bg-white/20"
            >
              <Link to="/reports">
                <PieChart className="mr-2 h-4 w-4" />
                View Reports
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Expenses
              </p>
              <h3 className="text-2xl font-bold mt-1">
                ${totalExpenses.toFixed(2)}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(), "MMMM yyyy")}
            </span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Top Category</p>
              {pieChartData.length > 0 ? (
                <h3 className="text-xl font-bold mt-1">
                  {pieChartData.sort((a, b) => b.value - a.value)[0].name}
                </h3>
              ) : (
                <h3 className="text-xl font-bold mt-1">No data yet</h3>
              )}
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <PieChart className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {pieChartData.length > 0 ? (
              <span className="flex items-center text-purple-600">
                <TrendingUp className="h-4 w-4 mr-1" />$
                {pieChartData
                  .sort((a, b) => b.value - a.value)[0]
                  .value.toFixed(2)}
              </span>
            ) : (
              <span>Add expenses to see data</span>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Recent Activity
              </p>
              <h3 className="text-xl font-bold mt-1">
                {recentExpenses.length} Recent Expenses
              </h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingDown className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <Link
              to="/expenses"
              className="flex items-center text-blue-600 hover:underline"
            >
              View all expenses
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Expense Distribution & Recent Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold mb-6">Expense Distribution</h2>
          <div className="h-64">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.color] || "#8884d8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value.toFixed(2)}`, "Amount"]}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>No expense data to display</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Expenses</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/expenses">View All</Link>
            </Button>
          </div>

          {recentExpenses.length > 0 ? (
            <div className="space-y-4">
              {recentExpenses.map((expense) => {
                const category = getCategoryById(expense.categoryId);
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      {category && (
                        <div
                          className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center text-white mr-3`}
                        >
                          <DollarSign className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-gray-500">
                          {category ? category.name : "Uncategorized"} •{" "}
                          {format(new Date(expense.date), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold">
                      ${Number(expense.amount).toFixed(2)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent expenses</p>
              <Button
                onClick={() => setShowExpenseForm(true)}
                variant="outline"
                className="mt-4"
              >
                Add Your First Expense
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Expense Form Dialog */}
      {showExpenseForm && (
        <ExpenseForm onClose={() => setShowExpenseForm(false)} />
      )}
    </div>
  );
};

export default Dashboard;
