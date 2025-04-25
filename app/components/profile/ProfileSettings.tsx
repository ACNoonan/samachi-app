'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Wallet, Bell, Globe, Shield, HelpCircle, LogOut, 
  ChevronRight, Moon, Sun
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';

// Define a more specific type for settings items
type SettingItem = {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  value?: string | boolean;
  toggle?: boolean;
  onChange?: (checked: boolean) => void;
};

export const ProfileSettings: React.FC = () => {
  const router = useRouter();
  const { user, profile, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  const handleLogout = async () => {
    try {
      await logout();
      // No need to manually redirect as the auth state change will trigger a redirect
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  // Use the defined type
  const settingGroups: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Account',
      items: [
        {
          icon: User, 
          label: 'Personal Information',
          onClick: () => { console.log("Navigate to personal info"); /* TODO: router.push('/profile/info') */ },
        },
        {
          icon: Wallet, 
          label: 'Connected Wallet',
          value: profile?.walletAddress ? `${profile.walletAddress.substring(0, 6)}...${profile.walletAddress.substring(profile.walletAddress.length - 4)}` : 'Not Connected',
          onClick: () => router.push('/connect-wallet'),
        },
        {
          icon: LogOut,
          label: 'Sign Out',
          onClick: handleLogout,
        },
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell, 
          label: 'Notifications',
          toggle: true,
          value: notifications,
          onChange: (checked) => setNotifications(checked),
        },
        {
          icon: Globe, 
          label: 'Language',
          value: 'English',
          onClick: () => { console.log("Change language"); /* TODO: Implement language change */ },
        },
        {
          icon: darkMode ? Moon : Sun, 
          label: 'Dark Mode',
          toggle: true,
          value: darkMode,
          onChange: (checked) => setDarkMode(checked),
        },
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: Shield, 
          label: 'Privacy & Security',
          onClick: () => { console.log("Navigate to privacy"); /* TODO: router.push('/privacy') */ },
        },
        {
          icon: HelpCircle, 
          label: 'Help & Support',
          onClick: () => { console.log("Navigate to support"); /* TODO: router.push('/support') */ },
        },
      ]
    },
  ];

  return (
    <div className="flex flex-col pt-10 pb-20 px-6">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      
      <div className="glass-card p-6 mb-8 animate-fade-in">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mr-4">
            {/* Use profile username or user email initial */}
            {profile?.username ? profile.username.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'S')}
          </div>
          <div>
            {/* Display profile name/username or user email */}
            <h2 className="text-xl font-semibold">{profile?.name || profile?.username || user?.email || 'Samachi Member'}</h2>
          </div>
        </div>
      </div>

      {settingGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-8 animate-fade-in">
          <h2 className="text-lg font-semibold mb-3">{group.title}</h2>
          
          <div className="glass-card divide-y divide-gray-100/50 overflow-hidden">
            {group.items.map((item, itemIndex) => (
              <div 
                key={itemIndex} 
                className={`p-4 flex justify-between items-center ${
                  !item.toggle && item.onClick ? 'cursor-pointer hover:bg-white/60' : '' // Adjust condition
                }`}
                onClick={!item.toggle && item.onClick ? item.onClick : undefined}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                
                <div className="flex items-center">
                  {item.value && typeof item.value === 'string' && !item.toggle && (
                    <span className="text-sm text-muted-foreground mr-2">{item.value}</span>
                  )}
                  
                  {item.toggle && typeof item.onChange === 'function' ? (
                    <Switch 
                      checked={item.value as boolean} 
                      onCheckedChange={item.onChange}
                    />
                  ) : (
                    item.onClick && <ChevronRight className="h-5 w-5 text-muted-foreground" /> // Only show chevron if clickable
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
