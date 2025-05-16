
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuthForm from '@/components/AuthForm';
import Logo from '@/components/Logo';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="datemate-gradient p-6 flex items-center">
        <Button 
          variant="ghost" 
          className="text-white" 
          onClick={() => navigate('/welcome')}
        >
          Back
        </Button>
        <div className="flex-1 text-center">
          <Logo size="medium" variant="full" className="text-white inline-block" />
        </div>
        <div className="w-10"></div> {/* Empty div for spacing */}
      </div>
      
      <div className="flex-1 p-8 datemate-container flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center font-montserrat">
            Create Your Account
          </h1>
          
          <AuthForm type="signup" onSuccess={handleAuthSuccess} />
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-datemate-red hover:underline font-medium"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
