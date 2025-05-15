
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Trash2, 
  AlertTriangle,
  Download,
  Upload,
  Moon,
  Sun,
  Bell,
  DollarSign,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useToast } from '@/components/ui/use-toast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const Settings = () => {
  const { toast } = useToast();
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [userSettings, setUserSettings] = useState({
    name: 'User',
    currency: 'USD',
    darkMode: false,
    notifications: true,
    defaultView: 'dashboard'
  });

  const handleSettingChange = (setting, value) => {
    setUserSettings({
      ...userSettings,
      [setting]: value
    });
  };

  const saveSettings = () => {
    // In a real app, this would save to localStorage or a backend
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    });
  };

  const resetAllData = () => {
    // Clear all localStorage data
    localStorage.removeItem('expenses');
    localStorage.removeItem('categories');
    
    toast({
      title: "Data reset complete",
      description: "All your expense data has been deleted",
      variant: "destructive",
    });
    
    setResetConfirmOpen(false);
    
    // In a real app, you might want to refresh the page or update state
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const exportData = () => {
    try {
      const expenses = localStorage.getItem('expenses') || '[]';
      const categories = localStorage.getItem('categories') || '[]';
      
      const exportData = {
        expenses: JSON.parse(expenses),
        categories: JSON.parse(categories),
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `expense-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Export successful",
        description: "Your expense data has been exported",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data",
        variant: "destructive",
      });
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.expenses && Array.isArray(data.expenses)) {
          localStorage.setItem('expenses', JSON.stringify(data.expenses));
        }
        
        if (data.categories && Array.isArray(data.categories)) {
          localStorage.setItem('categories', JSON.stringify(data.categories));
        }
        
        toast({
          title: "Import successful",
          description: "Your expense data has been imported",
        });
        
        // Reset the file input
        event.target.value = null;
        
        // In a real app, you might want to refresh the page or update state
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The selected file contains invalid data",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        Settings
      </motion.h1>

      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="preferences" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Data Management
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Sun className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-6">User Preferences</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={userSettings.name}
                  onChange={(e) => handleSettingChange('name', e.target.value)}
                  className="max-w-md"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={userSettings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                  className="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultView">Default View</Label>
                <select
                  id="defaultView"
                  value={userSettings.defaultView}
                  onChange={(e) => handleSettingChange('defaultView', e.target.value)}
                  className="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="expenses">Expenses</option>
                  <option value="reports">Reports</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifications"
                  checked={userSettings.notifications}
                  onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                />
                <Label htmlFor="notifications" className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Enable notifications
                </Label>
              </div>
              
              <Button onClick={saveSettings} className="mt-4">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="data">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-6">Data Management</h2>
            
            <div className="space-y-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-700">Export Your Data</h3>
                <p className="text-blue-600 mb-4">Download all your expense data as a JSON file for backup or transfer.</p>
                <Button onClick={exportData} variant="outline" className="bg-white">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-green-700">Import Data</h3>
                <p className="text-green-600 mb-4">Import expense data from a previously exported file.</p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    className="bg-white relative"
                    onClick={() => document.getElementById('import-file').click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select File
                    <input
                      id="import-file"
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </Button>
                  <p className="text-sm text-gray-500">Only .json files exported from ExpenseTrackr are supported</p>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-red-700">Reset All Data</h3>
                <p className="text-red-600 mb-4">This will permanently delete all your expense data and categories. This action cannot be undone.</p>
                <Button 
                  variant="destructive" 
                  onClick={() => setResetConfirmOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset All Data
                </Button>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-6">Appearance Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="darkMode"
                  checked={userSettings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                />
                <Label htmlFor="darkMode" className="flex items-center">
                  <Moon className="h-4 w-4 mr-2" />
                  Dark Mode (Coming Soon)
                </Label>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Theme Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                    <h4 className="font-medium">Default Theme</h4>
                    <p className="text-sm opacity-80">Current</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white opacity-60">
                    <h4 className="font-medium">Purple Haze</h4>
                    <p className="text-sm opacity-80">Coming Soon</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-4 text-white opacity-60">
                    <h4 className="font-medium">Emerald</h4>
                    <p className="text-sm opacity-80">Coming Soon</p>
                  </div>
                </div>
              </div>
              
              <Button onClick={saveSettings} className="mt-4">
                <Save className="mr-2 h-4 w-4" />
                Save Appearance
              </Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Reset All Data?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your expenses and categories. This action cannot be undone.
              <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md">
                Consider exporting your data first as a backup.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={resetAllData} className="bg-red-600 hover:bg-red-700">
              Yes, Delete Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
