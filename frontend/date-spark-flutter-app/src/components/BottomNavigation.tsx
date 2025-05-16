
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Heart, BarChart2 } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-datemate-black shadow-lg rounded-t-xl max-w-md mx-auto">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => navigate('/home')}
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            isActive('/home') ? 'text-datemate-red' : 'text-gray-500'
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button
          onClick={() => navigate('/practice')}
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            isActive('/practice') ? 'text-datemate-red' : 'text-gray-500'
          }`}
        >
          <Heart size={24} />
          <span className="text-xs mt-1">Practice</span>
        </button>
        
        <button
          onClick={() => navigate('/progress')}
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            isActive('/progress') ? 'text-datemate-red' : 'text-gray-500'
          }`}
        >
          <BarChart2 size={24} />
          <span className="text-xs mt-1">Progress</span>
        </button>
        
        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center justify-center w-1/4 h-full ${
            isActive('/profile') ? 'text-datemate-red' : 'text-gray-500'
          }`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
