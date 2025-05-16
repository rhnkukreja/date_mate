
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type Scenario = {
  id: string;
  name: string;
  personality: string;
  environment: string;
  age: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  imageUrl?: string;
};

type ScenarioCardProps = {
  scenario: Scenario;
  onClick: (scenario: Scenario) => void;
};

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onClick }) => {
  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500',
  };

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer animate-scale-in"
      onClick={() => onClick(scenario)}
    >
      <div 
        className="h-32 bg-cover bg-center" 
        style={{ 
          backgroundImage: scenario.imageUrl 
            ? `url(${scenario.imageUrl})` 
            : 'linear-gradient(135deg, #FF3366 0%, #FF66B2 100%)' 
        }}
      />
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{scenario.name}, {scenario.age}</CardTitle>
          <Badge className={difficultyColors[scenario.difficulty]}>
            {scenario.difficulty}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {scenario.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            {scenario.personality}
          </Badge>
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            {scenario.environment}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="text-xs text-gray-500">
          Tap to practice with this scenario
        </div>
      </CardFooter>
    </Card>
  );
};

export default ScenarioCard;
