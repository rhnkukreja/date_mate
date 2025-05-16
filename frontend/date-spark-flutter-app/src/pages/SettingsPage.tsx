
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Bell, Volume2, Lock, LogOut, ChevronRight } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    notifications: {
      practiceReminders: true,
      weeklyProgress: true,
      newFeatures: false
    },
    audio: {
      speechVolume: 80,
      soundEffects: true
    },
    privacy: {
      saveConversations: true,
      anonymizedData: true
    }
  });
  
  const handleSwitchChange = (category: string, setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: !prev[category as keyof typeof prev][setting as keyof typeof prev[keyof typeof prev]]
      }
    }));
    
    toast({
      title: "Setting updated",
      description: `${setting} is now ${!settings[category as keyof typeof settings][setting as keyof typeof settings[keyof typeof settings]] ? 'enabled' : 'disabled'}.`
    });
  };
  
  const handleSliderChange = (value: number[]) => {
    setSettings(prev => ({
      ...prev,
      audio: {
        ...prev.audio,
        speechVolume: value[0]
      }
    }));
  };
  
  const handleLogout = () => {
    // In a real app, we would clear auth tokens here
    toast({
      title: "Logged out successfully"
    });
    navigate('/welcome');
  };
  
  // Settings section renderer
  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    description: string,
    control: React.ReactNode,
  ) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-start">
        <div className="mr-3 mt-0.5">{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {control}
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="datemate-gradient p-6 flex items-center">
        <Button 
          variant="ghost" 
          className="text-white" 
          onClick={() => navigate('/profile')}
        >
          Back
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-white font-montserrat">
            Settings
          </h1>
        </div>
        <div className="w-10"></div> {/* Empty div for spacing */}
      </div>
      
      {/* Main Content */}
      <div className="px-6 py-6 datemate-container">
        {/* Notification Settings */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Bell size={18} className="mr-2 text-datemate-red" />
            <h2 className="text-lg font-semibold font-montserrat">Notifications</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
            {renderSettingItem(
              <Bell size={16} className="text-gray-500" />,
              "Practice Reminders",
              "Receive reminders to practice regularly",
              <Switch 
                checked={settings.notifications.practiceReminders}
                onCheckedChange={() => handleSwitchChange('notifications', 'practiceReminders')}
              />
            )}
            
            <Separator />
            
            {renderSettingItem(
              <Bell size={16} className="text-gray-500" />,
              "Weekly Progress",
              "Get updates on your weekly progress",
              <Switch 
                checked={settings.notifications.weeklyProgress}
                onCheckedChange={() => handleSwitchChange('notifications', 'weeklyProgress')}
              />
            )}
            
            <Separator />
            
            {renderSettingItem(
              <Bell size={16} className="text-gray-500" />,
              "New Features",
              "Be notified about app updates and new features",
              <Switch 
                checked={settings.notifications.newFeatures}
                onCheckedChange={() => handleSwitchChange('notifications', 'newFeatures')}
              />
            )}
          </div>
        </div>
        
        {/* Audio Settings */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Volume2 size={18} className="mr-2 text-datemate-red" />
            <h2 className="text-lg font-semibold font-montserrat">Audio</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
            <div className="py-3">
              <div className="flex items-center justify-between mb-2">
                <Label className="font-medium">Speech Volume: {settings.audio.speechVolume}%</Label>
              </div>
              <Slider
                defaultValue={[settings.audio.speechVolume]}
                max={100}
                step={1}
                value={[settings.audio.speechVolume]}
                onValueChange={handleSliderChange}
              />
            </div>
            
            <Separator />
            
            {renderSettingItem(
              <Volume2 size={16} className="text-gray-500" />,
              "Sound Effects",
              "Enable sound effects during practice",
              <Switch 
                checked={settings.audio.soundEffects}
                onCheckedChange={() => handleSwitchChange('audio', 'soundEffects')}
              />
            )}
          </div>
        </div>
        
        {/* Privacy Settings */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Lock size={18} className="mr-2 text-datemate-red" />
            <h2 className="text-lg font-semibold font-montserrat">Privacy</h2>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
            {renderSettingItem(
              <Lock size={16} className="text-gray-500" />,
              "Save Conversations",
              "Store your practice conversations for review",
              <Switch 
                checked={settings.privacy.saveConversations}
                onCheckedChange={() => handleSwitchChange('privacy', 'saveConversations')}
              />
            )}
            
            <Separator />
            
            {renderSettingItem(
              <Lock size={16} className="text-gray-500" />,
              "Anonymized Data",
              "Allow anonymized data to improve the app",
              <Switch 
                checked={settings.privacy.anonymizedData}
                onCheckedChange={() => handleSwitchChange('privacy', 'anonymizedData')}
              />
            )}
          </div>
        </div>
        
        {/* Account Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 font-montserrat">Account</h2>
          
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <button
              className="w-full py-3 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              onClick={() => navigate('/subscription')}
            >
              <span className="font-medium">Subscription Settings</span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
            
            <Separator />
            
            <button
              className="w-full py-3 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              onClick={() => navigate('/help')}
            >
              <span className="font-medium">Help & Support</span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
            
            <Separator />
            
            <button
              className="w-full py-3 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              onClick={() => navigate('/privacy')}
            >
              <span className="font-medium">Privacy Policy</span>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>
        </div>
        
        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full text-datemate-red border-datemate-red hover:bg-datemate-red/5 flex items-center justify-center"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Log Out
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default SettingsPage;
