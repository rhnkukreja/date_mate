
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Edit, Star, Trophy, CreditCard, Clock } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { toast } from '@/components/ui/use-toast';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    dateJoined: 'April 2025',
    bio: 'Working on improving my dating conversation skills. Love coffee, books, and hiking.',
    imageUrl: '',
    plan: 'premium',
    nextBilling: 'May 15, 2025'
  });
  
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    bio: profile.bio
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    setProfile(prev => ({ ...prev, ...formData }));
    setIsEditingProfile(false);
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved."
    });
  };
  
  const achievements = [
    { 
      id: '1', 
      name: 'First Conversation', 
      description: 'Completed your first practice session',
      earned: true,
      date: 'Apr 10, 2025'
    },
    { 
      id: '2', 
      name: 'Conversation Enthusiast', 
      description: 'Completed 10 practice sessions',
      earned: true,
      date: 'Apr 20, 2025'
    },
    { 
      id: '3', 
      name: 'Smooth Talker', 
      description: 'Achieved 85%+ in smoothness',
      earned: true,
      date: 'Apr 23, 2025'
    },
    { 
      id: '4', 
      name: 'Master Conversationalist', 
      description: 'Completed 50 practice sessions',
      earned: false
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="datemate-gradient p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white font-montserrat">My Profile</h1>
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-white hover:text-datemate-red"
            onClick={() => navigate('/settings')}
          >
            Settings
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-6 py-6 datemate-container">
        {/* Profile Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-datemate-red/90 to-datemate-pink/90 p-6 flex items-center">
            <Avatar className="h-20 w-20 border-2 border-white">
              <AvatarImage src={profile.imageUrl || "/placeholder.svg"} />
              <AvatarFallback className="text-lg bg-datemate-black text-white">
                {profile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="ml-4 flex-1 text-white">
              <h2 className="text-xl font-bold font-montserrat">{profile.name}</h2>
              <p className="opacity-90">{profile.email}</p>
              <div className="mt-1 flex items-center">
                <Badge className="bg-white/20 hover:bg-white/30">
                  {profile.plan === 'premium' ? 'Premium Member' : 'Free User'}
                </Badge>
                <span className="ml-2 text-sm opacity-70">
                  Member since {profile.dateJoined}
                </span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              className="text-white p-2 ml-2"
              onClick={() => setIsEditingProfile(true)}
            >
              <Edit size={20} />
            </Button>
          </div>
          
          <CardContent className="p-6">
            <p className="text-gray-600">{profile.bio}</p>
          </CardContent>
        </Card>
        
        {/* Stats & Achievements */}
        <Tabs defaultValue="stats" className="mb-8">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star size={18} className="mr-2 text-datemate-red" />
                  Performance Stats
                </CardTitle>
                <CardDescription>Your conversation skills performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>Sessions Completed</div>
                    <div className="font-semibold">12</div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>Average Score</div>
                    <div className="font-semibold">76%</div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>Best Personality Match</div>
                    <div className="font-semibold">Outgoing</div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div>Strongest Skill</div>
                    <div className="font-semibold">Attentiveness</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>Area to Improve</div>
                    <div className="font-semibold">Confidence</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy size={18} className="mr-2 text-datemate-red" />
                  Your Achievements
                </CardTitle>
                <CardDescription>Milestones you've reached</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map(achievement => (
                    <div 
                      key={achievement.id}
                      className={`flex items-center p-3 rounded-lg border ${
                        achievement.earned ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100 opacity-60'
                      }`}
                    >
                      <div className={`mr-4 rounded-full p-2 ${
                        achievement.earned ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                      }`}>
                        <Trophy size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{achievement.name}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        {achievement.earned && (
                          <span className="text-xs text-gray-500">Earned on {achievement.date}</span>
                        )}
                      </div>
                      {!achievement.earned && (
                        <Badge variant="outline" className="bg-gray-100">
                          Locked
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Subscription Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard size={18} className="mr-2 text-datemate-red" />
              Subscription
            </CardTitle>
            <CardDescription>Your current plan and billing information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h3 className="font-semibold capitalize">{profile.plan} Plan</h3>
                <p className="text-sm text-gray-500">Unlimited practice sessions</p>
              </div>
              <Badge className={profile.plan === 'premium' ? 'bg-datemate-red' : 'bg-gray-500'}>
                Active
              </Badge>
            </div>
            
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Clock size={18} className="mr-2 text-gray-400" />
                <span>Next billing date</span>
              </div>
              <span className="font-medium">{profile.nextBilling}</span>
            </div>
            
            <Button 
              variant="outline"
              className="w-full mt-2"
              onClick={() => navigate('/subscription')}
            >
              Manage Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Edit Profile Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.imageUrl || "/placeholder.svg"} />
                <AvatarFallback className="text-lg bg-datemate-black text-white">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="absolute">
                Change
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="datemate-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="datemate-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="datemate-input"
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="datemate-button-primary">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
