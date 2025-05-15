
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  X,
  Check,
  AlertCircle,
  DollarSign, 
  Home, 
  Car, 
  Utensils, 
  ShoppingBag, 
  Film, 
  Plane, 
  Heart, 
  Plug,
  PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { useExpenses } from '@/contexts/ExpenseContext';

const COLORS = [
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Indigo', value: 'bg-indigo-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Pink', value: 'bg-pink-500' },
];

const ICONS = [
  'home', 'car', 'utensils', 'shopping-bag', 'film', 
  'plane', 'heart', 'gift', 'book', 'coffee', 'briefcase',
  'plug', 'wifi', 'phone', 'music', 'dollar-sign'
];

const Categories = () => {
  const { categories, addCategory, updateCategory, deleteCategory, getExpensesByCategory } = useExpenses();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'dollar-sign',
    color: 'bg-blue-500'
  });
  const [errors, setErrors] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color
    });
    setShowCategoryForm(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteError(null);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      const success = deleteCategory(categoryToDelete.id);
      if (!success) {
        setDeleteError("This category is being used by existing expenses and cannot be deleted.");
      } else {
        setDeleteConfirmOpen(false);
        setCategoryToDelete(null);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleIconSelect = (icon) => {
    setFormData({
      ...formData,
      icon
    });
  };

  const handleColorSelect = (color) => {
    setFormData({
      ...formData,
      color
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (editingCategory) {
      updateCategory(editingCategory.id, formData);
    } else {
      addCategory(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      icon: 'dollar-sign',
      color: 'bg-blue-500'
    });
    setEditingCategory(null);
    setShowCategoryForm(false);
    setErrors({});
  };

  const expensesByCategory = getExpensesByCategory();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Expense Categories
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button onClick={() => setShowCategoryForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </motion.div>
      </div>

      {/* Categories Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {categories.map((category) => {
            const categoryStats = expensesByCategory.find(c => c.id === category.id);
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className={`${category.color} h-2`} />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center text-white mr-3`}>
                        <span className="lucide">
                          {category.icon === 'dollar-sign' && <DollarSign className="h-5 w-5" />}
                          {category.icon === 'home' && <Home className="h-5 w-5" />}
                          {category.icon === 'car' && <Car className="h-5 w-5" />}
                          {category.icon === 'utensils' && <Utensils className="h-5 w-5" />}
                          {category.icon === 'shopping-bag' && <ShoppingBag className="h-5 w-5" />}
                          {category.icon === 'film' && <Film className="h-5 w-5" />}
                          {category.icon === 'plane' && <Plane className="h-5 w-5" />}
                          {category.icon === 'heart' && <Heart className="h-5 w-5" />}
                          {category.icon === 'plug' && <Plug className="h-5 w-5" />}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-900 h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteClick(category)}
                        className="text-red-600 hover:text-red-900 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 rounded-md p-2">
                      <p className="text-gray-500">Total Spent</p>
                      <p className="font-semibold">${categoryStats?.total.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-md p-2">
                      <p className="text-gray-500">Transactions</p>
                      <p className="font-semibold">{categoryStats?.count || 0}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {categories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <PieChart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No categories yet</h3>
            <p className="text-gray-500 mb-4">Create categories to organize your expenses</p>
            <Button onClick={() => setShowCategoryForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Category
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Category Form Dialog */}
      <Dialog open={showCategoryForm} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Update the details of your expense category.' 
                : 'Create a new category to organize your expenses.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Groceries, Rent, Entertainment"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-8 gap-2">
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleIconSelect(icon)}
                    className={`h-10 w-10 rounded-md flex items-center justify-center ${
                      formData.icon === icon 
                        ? `${formData.color} text-white` 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="lucide">
                      {icon === 'dollar-sign' && <DollarSign className="h-5 w-5" />}
                      {icon === 'home' && <Home className="h-5 w-5" />}
                      {icon === 'car' && <Car className="h-5 w-5" />}
                      {icon === 'utensils' && <Utensils className="h-5 w-5" />}
                      {icon === 'shopping-bag' && <ShoppingBag className="h-5 w-5" />}
                      {icon === 'film' && <Film className="h-5 w-5" />}
                      {icon === 'plane' && <Plane className="h-5 w-5" />}
                      {icon === 'heart' && <Heart className="h-5 w-5" />}
                      {icon === 'plug' && <Plug className="h-5 w-5" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="grid grid-cols-8 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleColorSelect(color.value)}
                    className={`h-10 w-10 rounded-md ${color.value} flex items-center justify-center`}
                  >
                    {formData.color === color.value && (
                      <Check className="h-5 w-5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{editingCategory ? 'Update Category' : 'Add Category'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{categoryToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {deleteError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{deleteError}</p>
            </div>
          )}
          
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

export default Categories;
