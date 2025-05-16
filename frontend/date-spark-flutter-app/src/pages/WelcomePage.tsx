
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Logo from '@/components/Logo';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top gradient section */}
      <div className="datemate-gradient h-1/2 min-h-[40vh] flex items-center justify-center rounded-b-[40px] shadow-lg">
        <div className="text-center">
          <Logo size="large" variant="full" className="text-white mb-4" />
          <h2 className="text-white text-2xl font-montserrat mt-4">
            Master the Art of Dating Conversations
          </h2>
        </div>
      </div>
      
      {/* Bottom content section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 datemate-container">
        <div className="mb-12 text-center">
          <h3 className="text-xl font-semibold mb-4 font-montserrat">
            Practice with AI Dating Partners
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Develop your conversation skills, boost your confidence, and get real-time feedback on your dating interactions.
          </p>
        </div>
        
        <div className="w-full space-y-4">
          <Button 
            className="datemate-button-primary w-full"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
          
          <Button 
            variant="outline" 
            className="datemate-button-secondary w-full"
            onClick={() => navigate('/login')}
          >
            I already have an account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
