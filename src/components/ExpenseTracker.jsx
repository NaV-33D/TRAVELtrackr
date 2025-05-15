
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Edit, 
  Trash2,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useExpenses } from '@/contexts/ExpenseContext';
import ExpenseForm from '@/components/ExpenseForm';
import { format } from 'date-fns';

const ExpenseTracker = () => {
  const { expenses, deleteExpense, getCategoryById } = useExpenses();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete.id);
      setDeleteConfirmOpen(false);
      setExpenseToDelete(null);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setDateRange({ start: null, end: null });
  };

  // Filter and sort expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? expense.categoryId === selectedCategory : true;
    const matchesDateRange = dateRange.start && dateRange.end 
      ? new Date(expense.date) >= new Date(dateRange.start) && new Date(expense.date) <= new Date(dateRange.end)
      : true;
    
    return matchesSearch && matchesCategory && matchesDateRange;
  }).sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    } else if (sortField === 'amount') {
      return sortDirection === 'asc'
        ? parseFloat(a.amount) - parseFloat(b.amount)
        : parseFloat(b.amount) - parseFloat(a.amount);
    } else if (sortField === 'description') {
      return sortDirection === 'asc'
        ? a.description.localeCompare(b.description)
        : b.description.localeCompare(a.description);
    }
    return 0;
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Expense Tracker
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button onClick={() => setShowExpenseForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter Expenses</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDateRange({ start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] })}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Today
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  const now = new Date();
                  const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                  setDateRange({ 
                    start: lastWeek.toISOString().split('T')[0], 
                    end: now.toISOString().split('T')[0] 
                  });
                }}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Last 7 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  const now = new Date();
                  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                  setDateRange({ 
                    start: lastMonth.toISOString().split('T')[0], 
                    end: now.toISOString().split('T')[0] 
                  });
                }}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Last 30 days
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={resetFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSort('date')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Date {sortField === 'date' && (sortDirection === 'asc' ? '(Oldest)' : '(Newest)')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('amount')}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Amount {sortField === 'amount' && (sortDirection === 'asc' ? '(Low to High)' : '(High to Low)')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort('description')}>
                  <Filter className="mr-2 h-4 w-4" />
                  Description {sortField === 'description' && (sortDirection === 'asc' ? '(A-Z)' : '(Z-A)')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Active filters display */}
        {(searchTerm || selectedCategory || dateRange.start) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {searchTerm && (
              <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-1 text-blue-600 hover:text-blue-800">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {selectedCategory && (
              <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                Category: {getCategoryById(selectedCategory)?.name}
                <button onClick={() => setSelectedCategory(null)} className="ml-1 text-purple-600 hover:text-purple-800">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {dateRange.start && dateRange.end && (
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                Date: {format(new Date(dateRange.start), 'MMM dd')} - {format(new Date(dateRange.end), 'MMM dd')}
                <button onClick={() => setDateRange({ start: null, end: null })} className="ml-1 text-green-600 hover:text-green-800">
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            <button 
              onClick={resetFilters}
              className="text-xs text-gray-600 hover:text-gray-900 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </motion.div>

      {/* Expenses List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        {filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('description')}
                      className="flex items-center font-medium"
                    >
                      Description {getSortIcon('description')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('date')}
                      className="flex items-center font-medium"
                    >
                      Date {getSortIcon('date')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('amount')}
                      className="flex items-center font-medium"
                    >
                      Amount {getSortIcon('amount')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredExpenses.map((expense) => {
                    const category = getCategoryById(expense.categoryId);
                    return (
                      <motion.tr 
                        key={expense.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.color.replace('bg-', 'bg-')}/20 text-${category.color.replace('bg-', '')}-800`}>
                              {category.name}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{format(new Date(expense.date), 'MMM dd, yyyy')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">${Number(expense.amount).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(expense)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteClick(expense)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4"
            >
              <DollarSign className="h-8 w-8 text-gray-400" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No expenses found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory || dateRange.start
                ? "Try adjusting your filters"
                : "Start by adding your first expense"}
            </p>
            {!(searchTerm || selectedCategory || dateRange.start) && (
              <Button onClick={() => setShowExpenseForm(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            )}
            {(searchTerm || selectedCategory || dateRange.start) && (
              <Button variant="outline" onClick={resetFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </motion.div>

      {/* Expense Form Dialog */}
      {showExpenseForm && (
        <ExpenseForm 
          expense={editingExpense} 
          onClose={() => {
            setShowExpenseForm(false);
            setEditingExpense(null);
          }} 
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the expense "{expenseToDelete?.description}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpenseTracker;
