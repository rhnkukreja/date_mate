
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center datemate-gradient animate-fade-in">
      <div className="text-center">
        <Logo size="large" variant="full" className="text-white mb-6" />
        
        <p className="text-white text-xl mt-4 font-montserrat">
          Practice makes perfect
        </p>
      </div>
      
      <div className="mt-16 animate-pulse">
        <div className="w-4 h-4 bg-white rounded-full mx-auto"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
