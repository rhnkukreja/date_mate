import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import ScenarioCard, { Scenario } from '@/components/ScenarioCard';
import BottomNavigation from '@/components/BottomNavigation';
import { Search } from 'lucide-react';
import { listAssistantSummaries, AssistantSummary as ApiAssistantSummary } from '@/services/api';

// Helper function to safely parse difficulty
const getDifficulty = (value?: string | null): 'easy' | 'medium' | 'hard' => {
  if (!value) return 'medium';
  const lower = value.toLowerCase();
  if (['easy', 'medium', 'hard'].includes(lower)) {
    return lower as 'easy' | 'medium' | 'hard';
  }
  return 'medium';
};

// Helper function to transform API data to Scenario data
const transformAssistantToScenario = (assistant: ApiAssistantSummary): Scenario => {
  const metadata = assistant.metadata;
  const name = metadata?.app_persona_name || assistant.name || 'Unknown Persona';
  
  let ageValue: number = 0; // Default to 0 if not specified or invalid
  if (metadata?.app_age !== undefined && metadata.app_age !== null) {
    const parsedAge = parseInt(String(metadata.app_age), 10);
    if (!isNaN(parsedAge)) {
      ageValue = parsedAge;
    }
  }

  const personality = metadata?.app_personality || 'Mysterious';
  const environment = metadata?.app_setting || 'A unique setting';
  const difficulty = getDifficulty(metadata?.app_difficulty);
  const description = metadata?.app_short_description || `An intriguing scenario with ${name}.`;
  const imageGenName = (name.split(' ').length > 1) ? name.split(' ')[0] : assistant.name || name;
  const imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(imageGenName)}&background=random&color=fff&bold=true`;

  return {
    id: assistant.id,
    name,
    age: ageValue, // Ensure age is always a number
    personality,
    environment,
    difficulty,
    description,
    imageUrl,
  };
};

const SCENARIOS_PER_PAGE = 4;

const ScenariosPage1: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [assistants, setAssistants] = useState<ApiAssistantSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        setLoading(true);
        const data = await listAssistantSummaries(); 
        setAssistants(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch assistants:", err);
        setError('Failed to load scenarios. Please try again later.');
        setAssistants([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchAssistants();
  }, []);

  if (loading) {
    return <div className="loading-message">Loading scenarios...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (assistants.length === 0) {
    return <div className="empty-message">No scenarios available at the moment.</div>;
  }

  const filteredAssistants = assistants.filter(assistant =>
    assistant.metadata?.app_persona_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (assistant.metadata?.app_short_description && assistant.metadata?.app_short_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (assistant.metadata?.app_personality && assistant.metadata?.app_personality.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (assistant.metadata?.app_setting && assistant.metadata?.app_setting.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const scenariosToDisplay: Scenario[] = filteredAssistants.map(transformAssistantToScenario);

  const totalPages = Math.ceil(scenariosToDisplay.length / SCENARIOS_PER_PAGE);
  const startIndex = (currentPage - 1) * SCENARIOS_PER_PAGE;
  const paginatedScenarios = scenariosToDisplay.slice(startIndex, startIndex + SCENARIOS_PER_PAGE);

  const handleScenarioClick = (scenario: Scenario) => {
    navigate(`/scenario/${scenario.id}`, { state: scenario });
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="datemate-gradient p-6 flex items-center sticky top-0 z-10">
        <Button 
          variant="ghost" 
          className="text-white" 
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-white font-montserrat">
            Your Scenarios
          </h1>
        </div>
        <div className="w-10"></div>
      </div>
      
      <div className="px-6 py-4 datemate-container">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10 datemate-input"
            placeholder="Search scenarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {paginatedScenarios.length > 0 ? (
          <>
            <div className="space-y-4 mb-6">
              {paginatedScenarios.map((scenario) => (
                <div key={scenario.id} className="w-full">
                  <ScenarioCard
                    scenario={scenario} // Pass the whole scenario object
                    onClick={() => handleScenarioClick(scenario)}
                  />
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center px-4 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
            {/* Full-width Create Custom Scenario button if scenarios exist */}
            <Button 
              className="datemate-button-primary w-full mt-8 py-3"
              onClick={() => navigate('/create-scenario')}
            >
              Create Custom Scenario
            </Button>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">No scenarios found. Create your first scenario to get started!</p>
            <Button 
              className="datemate-button-primary w-full max-w-xs mx-auto py-3"
              onClick={() => navigate('/create-scenario')}
            >
              Create Custom Scenario
            </Button>
          </div>
        )}
      </div>
        
      {/* Removed FAB as per new design incorporating full-width button */}
        
      <BottomNavigation />
    </div>
  );
}; 

export default ScenariosPage1;