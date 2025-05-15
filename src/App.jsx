
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import ExpenseTracker from '@/components/ExpenseTracker';
import Categories from '@/components/Categories';
import Reports from '@/components/Reports';
import Settings from '@/components/Settings';
import { ExpenseProvider } from '@/contexts/ExpenseContext';

function App() {
  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<ExpenseTracker />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </motion.div>
      </div>
    </ExpenseProvider>
  );
}

export default App;
