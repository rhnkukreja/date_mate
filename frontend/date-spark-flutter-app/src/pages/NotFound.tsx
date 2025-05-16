
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="datemate-gradient p-6 flex items-center justify-center">
        <Logo size="medium" variant="full" className="text-white" />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 datemate-container">
        <h1 className="text-6xl font-bold mb-6 text-datemate-red font-montserrat">404</h1>
        <p className="text-xl font-semibold mb-8 text-center">
          Oops! This page doesn't exist
        </p>
        <p className="text-gray-600 mb-8 text-center">
          We can't find the page you're looking for. Let's get you back on track.
        </p>
        <Button 
          onClick={() => navigate('/home')} 
          className="datemate-button-primary"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
