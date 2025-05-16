
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FeedbackScore from '@/components/FeedbackScore';
import { Award, ThumbsUp, ThumbsDown } from 'lucide-react';

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();

  const overallScore = 78;
  const scores = {
    smoothness: 82,
    confidence: 75,
    attentiveness: 85,
    engagement: 70
  };

  const strengths = [
    "Asked thoughtful follow-up questions",
    "Maintained good conversational flow",
    "Showed genuine interest in the other person"
  ];

  const improvements = [
    "Try to vary your conversation topics more",
    "Work on confidence in responses",
    "Allow more time for the other person to speak"
  ];

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="datemate-gradient p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white font-montserrat">
            Session Feedback
          </h1>
          <p className="text-white opacity-90 mt-1">
            Coffee Shop Date with Emma
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-6 py-8 datemate-container -mt-6">
        <Card className="overflow-hidden animate-scale-in shadow-lg">
          <div className="bg-gradient-to-r from-datemate-red to-datemate-pink py-8 px-6 text-center">
            <div className="inline-flex items-center justify-center bg-white/20 rounded-full p-4 mb-4">
              <Award size={40} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white">{overallScore}%</h2>
            <p className="text-white text-lg mt-2 font-montserrat">
              {overallScore >= 80 ? 'Great job!' : overallScore >= 60 ? 'Good effort!' : 'Keep practicing!'}
            </p>
          </div>
          <CardContent className="p-6">
            <Tabs defaultValue="scores">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="scores">Scores</TabsTrigger>
                <TabsTrigger value="strengths">Strengths</TabsTrigger>
                <TabsTrigger value="improve">Improve</TabsTrigger>
              </TabsList>
              
              <TabsContent value="scores">
                <div>
                  <FeedbackScore label="Smoothness" score={scores.smoothness} color="#4CAF50" delay={0} />
                  <FeedbackScore label="Confidence" score={scores.confidence} color="#2196F3" delay={200} />
                  <FeedbackScore label="Attentiveness" score={scores.attentiveness} color="#9C27B0" delay={400} />
                  <FeedbackScore label="Engagement" score={scores.engagement} color="#FF9800" delay={600} />
                </div>
              </TabsContent>
              
              <TabsContent value="strengths">
                <div className="space-y-4">
                  {strengths.map((strength, i) => (
                    <div key={i} className="flex items-start animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                      <ThumbsUp className="text-green-500 mr-3 flex-shrink-0 mt-1" size={20} />
                      <p>{strength}</p>
                    </div>
                  ))}
                  
                  <div className="bg-green-50 border border-green-100 p-4 rounded-lg mt-6">
                    <h3 className="text-green-800 font-medium mb-2">Key Takeaway</h3>
                    <p className="text-green-700">
                      Your ability to maintain interest and ask good follow-up questions is a strong foundation for meaningful conversations.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="improve">
                <div className="space-y-4">
                  {improvements.map((improvement, i) => (
                    <div key={i} className="flex items-start animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                      <ThumbsDown className="text-amber-500 mr-3 flex-shrink-0 mt-1" size={20} />
                      <p>{improvement}</p>
                    </div>
                  ))}
                  
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg mt-6">
                    <h3 className="text-amber-800 font-medium mb-2">Practice Tip</h3>
                    <p className="text-amber-700">
                      Try to practice active listening by repeating back what the other person has said before responding.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row gap-4">
              <Button 
                className="datemate-button-primary flex-1"
                onClick={() => navigate('/scenarios')}
              >
                Practice Again
              </Button>
              
              <Button 
                variant="outline" 
                className="datemate-button-secondary flex-1"
                onClick={() => navigate('/home')}
              >
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Conversation Highlights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Conversation Highlights</CardTitle>
            <CardDescription>Key moments from your conversation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-2">
                  Strong Response
                </Badge>
                <p className="text-sm font-medium">"I actually come here pretty often. Their cappuccinos are my favorite. Have you tried one yet?"</p>
                <p className="text-xs text-gray-500 mt-1">Shows engagement and invites further conversation</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mb-2">
                  Could Improve
                </Badge>
                <p className="text-sm font-medium">"Yeah, I like it here."</p>
                <p className="text-xs text-gray-500 mt-1">Short response that doesn't add depth to the conversation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackPage;
