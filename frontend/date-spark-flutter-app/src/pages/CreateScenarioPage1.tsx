import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { createAgent } from '@/services/api';

const CreateScenarioPage1: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: 28,
    personality: '',
    environment: '',
    difficulty: 'medium',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, age: value[0] }));
  };

  const VOICE_MODELS = [
    "piTKgcLEGmPE4e6mEKli",
    "9BWtsMINqrJLrRacOk9x",
    "8N2ng9i2uiUWqstgmWlH",
    "Ky9j3wxFbp3dSAdrkOEv",
    "ZncGbt9ecxkwpmaX6V9z"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate all required fields
      if (!formData.name.trim()) {
        throw new Error('Please enter a name for the scenario');
      }
      if (!formData.personality) {
        throw new Error('Please select a personality type');
      }
      if (!formData.environment) {
        throw new Error('Please select a dating environment');
      }
      if (!formData.description.trim()) {
        throw new Error('Please provide a scenario description');
      }

      // RANDOMLY SELECT A VOICE MODEL ID 
      const randomVoiceModel = VOICE_MODELS[Math.floor(Math.random() * VOICE_MODELS.length)];
      
      console.log('Submitting form with data:', {
        ...formData,
        voice_model: randomVoiceModel
      });
      
      const payload = {
        name: formData.name.trim(),
        age: formData.age,
        personality: formData.personality,
        setting: formData.environment,
        difficulty: formData.difficulty,
        scenario_description: formData.description.trim(),
        voice_model: randomVoiceModel
      };
      
      console.log('Sending payload to API:', payload);
      
      console.log('Sending create agent request with payload:', JSON.stringify(payload, null, 2));
      const response = await createAgent(payload);
      console.log('API Response:', response);
      
      if (!response?.assistant_id) {
        throw new Error('Failed to create scenario: No assistant ID received');
      }
      
      toast({
        title: 'Success!',
        description: 'Scenario created successfully',
        variant: 'default',
      });
      
      // Navigate to the scenarios page to see the new agent
      navigate('/scenarios', { state: { refresh: true } });
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create scenario. Please try again.';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="datemate-gradient p-6 flex items-center">
        <Button 
          variant="ghost" 
          className="text-white" 
          onClick={() => navigate('/scenarios')}
        >
          Back
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-white font-montserrat">
            Create Custom Scenario
          </h1>
        </div>
        <div className="w-10"></div> {/* Empty div for spacing */}
      </div>
      
      {/* Main Content */}
      <div className="px-6 py-4 datemate-container">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* AI Partner Name */}
          <div className="space-y-2">
            <Label htmlFor="name">AI Partner Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter a name"
              value={formData.name}
              onChange={handleChange}
              required
              className="datemate-input"
            />
          </div>
          
          {/* Partner Age */}
          <div className="space-y-2">
            <Label>Partner Age: {formData.age}</Label>
            <Slider
              defaultValue={[28]}
              min={18}
              max={65}
              step={1}
              value={[formData.age]}
              onValueChange={handleSliderChange}
              className="my-6"
            />
          </div>
          
          {/* Personality */}
          <div className="space-y-2">
            <Label htmlFor="personality">Personality Type</Label>
            <Select
              value={formData.personality}
              onValueChange={(value) => handleSelectChange('personality', value)}
              required
            >
              <SelectTrigger className="datemate-input">
                <SelectValue placeholder="Select personality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outgoing">Outgoing</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="witty">Witty</SelectItem>
                <SelectItem value="mysterious">Mysterious</SelectItem>
                <SelectItem value="adventurous">Adventurous</SelectItem>
                <SelectItem value="intellectual">Intellectual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Environment */}
          <div className="space-y-2">
            <Label htmlFor="environment">Dating Environment</Label>
            <Select
              value={formData.environment}
              onValueChange={(value) => handleSelectChange('environment', value)}
              required
            >
              <SelectTrigger className="datemate-input">
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coffee-shop">Coffee Shop</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
                <SelectItem value="art-gallery">Art Gallery</SelectItem>
                <SelectItem value="park">Park</SelectItem>
                <SelectItem value="movie-theater">Movie Theater</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Difficulty */}
          <div className="space-y-2">
            <Label htmlFor="difficulty">Conversation Difficulty</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleSelectChange('difficulty', value)}
            >
              <SelectTrigger className="datemate-input">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy - Friendly & Responsive</SelectItem>
                <SelectItem value="medium">Medium - Some Challenges</SelectItem>
                <SelectItem value="hard">Hard - Complex & Unpredictable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Scenario Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the scenario and your partner's background..."
              value={formData.description}
              onChange={handleChange}
              className="datemate-input min-h-[100px]"
              required
            />
          </div>
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="datemate-button-primary w-full"
            disabled={loading || !formData.name || !formData.personality || !formData.environment}
          >
            {loading ? 'Creating Scenario...' : 'Create Scenario'}
          </Button>
        </form>
      </div>
    </div>
  )
};

export default CreateScenarioPage1;