
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Clock } from 'lucide-react';
import Logo from '@/components/Logo';
import BottomNavigation from '@/components/BottomNavigation';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const recentSessions = [
    {
      id: '1',
      name: 'Coffee Shop Chat',
      date: '2 days ago',
      score: 78,
      completed: true
    },
    {
      id: '2',
      name: 'Dinner Date',
      date: '5 days ago',
      score: 82,
      completed: true
    }
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="datemate-gradient p-6 rounded-b-[20px]">
        <div className="flex justify-between items-center">
          <Logo size="medium" variant="full" className="text-white" />
          <Button variant="ghost" className="text-white p-2" onClick={() => navigate('/settings')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </Button>
        </div>
        <div className="mt-6 text-white">
          <h1 className="text-2xl font-bold font-montserrat">Hello, Friend!</h1>
          <p className="opacity-90">Ready to improve your dating conversations?</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-6 py-8 datemate-container">
        {/* Quick Action Card */}
        <Card className="mb-8 overflow-hidden shadow-md">
          <div className="bg-gradient-to-r from-datemate-red to-datemate-pink p-6 text-white">
            <h2 className="text-xl font-bold font-montserrat">Start a new practice session</h2>
            <p className="mt-2 opacity-90">Choose a scenario and begin your conversation</p>
          </div>
          <CardContent className="p-6">
            <Button 
              className="datemate-button-primary w-full mt-4"
              onClick={() => navigate('/scenarios')}
            >
              Choose a Scenario
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </CardContent>
        </Card>
        
        {/* Recent Sessions */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold font-montserrat">Recent Sessions</h2>
            <Button 
              variant="ghost" 
              className="text-datemate-red p-0"
              onClick={() => navigate('/progress')}
            >
              View All
            </Button>
          </div>
          
          {recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map(session => (
                <div 
                  key={session.id}
                  className="border rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigate(`/sessions/${session.id}`)}
                >
                  <div className="flex items-center">
                    <div className="bg-gray-100 rounded-full p-2 mr-3">
                      {session.completed ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : (
                        <Clock size={20} className="text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{session.name}</h3>
                      <p className="text-sm text-gray-500">{session.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{session.score}%</div>
                    <p className="text-xs text-gray-500">Overall Score</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No recent sessions</p>
              <Button 
                variant="link" 
                className="text-datemate-red"
                onClick={() => navigate('/scenarios')}
              >
                Start your first session
              </Button>
            </div>
          )}
        </div>
        
        {/* Quick Tips */}
        <div>
          <h2 className="text-lg font-semibold mb-4 font-montserrat">Quick Tips</h2>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-medium text-blue-800">Tip of the day:</h3>
            <p className="text-blue-700 mt-1">
              Ask open-ended questions that require more than a yes/no answer to keep the conversation flowing.
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;
