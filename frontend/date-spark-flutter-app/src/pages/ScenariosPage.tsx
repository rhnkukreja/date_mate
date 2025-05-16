
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import ScenarioCard, { Scenario } from '@/components/ScenarioCard';
import BottomNavigation from '@/components/BottomNavigation';
import { Search } from 'lucide-react';

const ScenariosPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const scenariosData: Scenario[] = [
    {
      id: '1',
      name: 'Emma',
      personality: 'Outgoing',
      environment: 'Coffee Shop',
      age: 28,
      difficulty: 'easy',
      description: 'A friendly first date at a local coffee shop. Emma is outgoing and loves to talk about travel.'
    },
    {
      id: '2',
      name: 'Michael',
      personality: 'Reserved',
      environment: 'Restaurant',
      age: 32,
      difficulty: 'medium',
      description: 'A dinner date with Michael who is somewhat reserved but opens up when talking about his interests.'
    },
    {
      id: '3',
      name: 'Sofia',
      personality: 'Witty',
      environment: 'Bar',
      age: 26,
      difficulty: 'medium',
      description: 'A casual meet-up at a bar with Sofia who has a quick wit and loves intellectual conversations.'
    },
    {
      id: '4',
      name: 'James',
      personality: 'Mysterious',
      environment: 'Art Gallery',
      age: 34,
      difficulty: 'hard',
      description: 'An art gallery date with James who is mysterious and has strong opinions about art and culture.'
    }
  ];

  const filteredScenarios = searchQuery
    ? scenariosData.filter(scenario =>
        scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scenario.personality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scenario.environment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scenario.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : scenariosData;

  const handleScenarioClick = (scenario: Scenario) => {
    navigate(`/scenario/${scenario.id}`);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="datemate-gradient p-6 flex items-center">
        <Button 
          variant="ghost" 
          className="text-white" 
          onClick={() => navigate('/home')}
        >
          Back
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-white font-montserrat">
            Choose a Scenario
          </h1>
        </div>
        <div className="w-10"></div> {/* Empty div for spacing */}
      </div>
      
      {/* Main Content */}
      <div className="px-6 py-4 datemate-container">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10 datemate-input"
            placeholder="Search scenarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="space-y-4">
              {filteredScenarios.length > 0 ? (
                filteredScenarios.map(scenario => (
                  <ScenarioCard 
                    key={scenario.id} 
                    scenario={scenario} 
                    onClick={handleScenarioClick} 
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No scenarios found matching "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="popular">
            <div className="space-y-4">
              {filteredScenarios
                .filter(s => s.difficulty !== 'hard')
                .map(scenario => (
                  <ScenarioCard 
                    key={scenario.id} 
                    scenario={scenario} 
                    onClick={handleScenarioClick} 
                  />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            <div className="space-y-4">
              <ScenarioCard 
                scenario={{
                  id: '5',
                  name: 'Olivia',
                  personality: 'Adventurous',
                  environment: 'Hiking Trail',
                  age: 29,
                  difficulty: 'medium',
                  description: 'An outdoor date with Olivia who loves adventure and the great outdoors.'
                }} 
                onClick={handleScenarioClick} 
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Create Custom Scenario Button */}
        <Button 
          className="datemate-button-primary w-full"
          onClick={() => navigate('/create-scenario')}
        >
          Create Custom Scenario
        </Button>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ScenariosPage;
