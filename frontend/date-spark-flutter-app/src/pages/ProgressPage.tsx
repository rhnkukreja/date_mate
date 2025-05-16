
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart2, Calendar, TrendingUp } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

// Import from Recharts
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';

const ProgressPage: React.FC = () => {
  const navigate = useNavigate();

  // Sample data for charts
  const lineChartData = [
    { date: 'Apr 10', score: 65 },
    { date: 'Apr 12', score: 68 },
    { date: 'Apr 15', score: 72 },
    { date: 'Apr 18', score: 70 },
    { date: 'Apr 20', score: 78 },
    { date: 'Apr 23', score: 75 },
    { date: 'Apr 26', score: 82 },
  ];

  const barChartData = [
    { category: 'Smoothness', score: 78 },
    { category: 'Confidence', score: 65 },
    { category: 'Attentiveness', score: 82 },
    { category: 'Engagement', score: 70 },
  ];

  const sessionHistory = [
    {
      id: '1',
      name: 'Coffee Shop Chat',
      partner: 'Emma',
      date: 'Apr 26, 2025',
      score: 82,
      improvement: '+7%'
    },
    {
      id: '2',
      name: 'Dinner Date',
      partner: 'Michael',
      date: 'Apr 23, 2025',
      score: 75,
      improvement: '+3%'
    },
    {
      id: '3',
      name: 'Art Gallery',
      partner: 'James',
      date: 'Apr 20, 2025',
      score: 78,
      improvement: '+8%'
    },
    {
      id: '4',
      name: 'Bar Meetup',
      partner: 'Sofia',
      date: 'Apr 18, 2025',
      score: 70,
      improvement: '-2%'
    },
    {
      id: '5',
      name: 'Coffee Shop Chat',
      partner: 'Emma',
      date: 'Apr 15, 2025',
      score: 72,
      improvement: '+4%'
    }
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="datemate-gradient p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white font-montserrat">My Progress</h1>
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-white hover:text-datemate-red"
            onClick={() => navigate('/scenarios')}
          >
            Practice
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-6 py-6 datemate-container">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="font-semibold text-sm text-gray-600">Sessions</div>
            <div className="text-3xl font-bold mt-2">12</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="font-semibold text-sm text-gray-600">Avg. Score</div>
            <div className="text-3xl font-bold mt-2">76%</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="font-semibold text-sm text-gray-600">Best Score</div>
            <div className="text-3xl font-bold mt-2 text-datemate-red">82%</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="font-semibold text-sm text-gray-600">Improvement</div>
            <div className="text-3xl font-bold mt-2 text-green-500">+17%</div>
          </Card>
        </div>
        
        {/* Charts */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <TrendingUp size={18} className="mr-2 text-datemate-red" />
              Progress Over Time
            </CardTitle>
            <CardDescription>Your conversation scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#FF3366"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BarChart2 size={18} className="mr-2 text-datemate-red" />
              Skill Breakdown
            </CardTitle>
            <CardDescription>Your performance by conversation skill</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar
                    dataKey="score"
                    fill="#FF3366"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Session History */}
        <div>
          <h2 className="text-xl font-semibold mb-4 font-montserrat flex items-center">
            <Calendar size={20} className="mr-2 text-datemate-red" />
            Session History
          </h2>
          
          <Tabs defaultValue="list" className="mb-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <div className="space-y-3 mt-4">
                {sessionHistory.map((session) => (
                  <Card
                    key={session.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/sessions/${session.id}`)}
                  >
                    <div className="flex items-center p-4">
                      <div className="mr-4 bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center">
                        <span className="font-bold text-datemate-red text-lg">
                          {session.score}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{session.name}</h3>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            {session.partner} • {session.date}
                          </div>
                          <Badge
                            className={
                              session.improvement.startsWith('+')
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }
                          >
                            {session.improvement}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="calendar">
              <div className="bg-gray-50 p-6 rounded-lg text-center mt-4">
                <p className="text-gray-500">
                  Calendar view will be available in the next update.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ProgressPage;
