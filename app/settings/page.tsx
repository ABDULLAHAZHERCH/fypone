'use client';
import { useState } from 'react';
import AppLayout from '../../components/AppLayout';

export default function Settings() {
  const [userSettings, setUserSettings] = useState({
    name: 'Abdullah',
    email: 'abdullah@example.com',
    notifications: true,
    darkMode: false,
    avatar: {
      height: '175',
      weight: '70',
      measurements: {
        chest: '40',
        waist: '32',
        hips: '38'
      }
    }
  });

  const handleSettingChange = (section: string, field: string, value: any) => {
    setUserSettings(prev => {
      if (section === 'avatar' && typeof prev.avatar === 'object') {
        return {
          ...prev,
          avatar: {
            ...prev.avatar,
            [field]: value
          }
        };
      }
      return prev;
    });
  };

  const handleBasicChange = (field: string, value: any) => {
    setUserSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account and avatar preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Profile Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userSettings.name}
                  onChange={(e) => handleBasicChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userSettings.email}
                  onChange={(e) => handleBasicChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Avatar Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Digital Twin Settings</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={userSettings.avatar.height}
                  onChange={(e) => handleSettingChange('avatar', 'height', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={userSettings.avatar.weight}
                  onChange={(e) => handleSettingChange('avatar', 'weight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-foreground"
                />
              </div>
            </div>

            <h3 className="text-lg font-medium text-foreground mb-3">Body Measurements (inches)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Chest
                </label>
                <input
                  type="number"
                  value={userSettings.avatar.measurements.chest}
                  onChange={(e) => handleSettingChange('avatar', 'measurements', {
                    ...userSettings.avatar.measurements,
                    chest: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Waist
                </label>
                <input
                  type="number"
                  value={userSettings.avatar.measurements.waist}
                  onChange={(e) => handleSettingChange('avatar', 'measurements', {
                    ...userSettings.avatar.measurements,
                    waist: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hips
                </label>
                <input
                  type="number"
                  value={userSettings.avatar.measurements.hips}
                  onChange={(e) => handleSettingChange('avatar', 'measurements', {
                    ...userSettings.avatar.measurements,
                    hips: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-foreground"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>💡 Tip:</strong> Accurate measurements ensure better fit analysis in the virtual fitting room.
              </p>
            </div>
          </div>

          {/* App Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">App Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Email Notifications
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive updates about new arrivals and outfit recommendations
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={userSettings.notifications}
                  onChange={(e) => handleBasicChange('notifications', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Dark Mode
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use dark theme throughout the application
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={userSettings.darkMode}
                  onChange={(e) => handleBasicChange('darkMode', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
            
            <div className="flex space-x-4">
              <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                Export Data
              </button>
              <button className="text-red-600 hover:text-red-800 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}