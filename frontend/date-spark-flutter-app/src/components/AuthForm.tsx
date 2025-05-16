
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

type AuthFormProps = {
  type: 'login' | 'signup';
  onSuccess: () => void;
};

const AuthForm: React.FC<AuthFormProps> = ({ type, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real app, we would make an API call here
    setTimeout(() => {
      setLoading(false);
      // For demo purposes, we'll just accept any input
      toast({
        title: type === 'login' ? 'Logged in successfully!' : 'Account created successfully!',
        description: "Welcome to DateMate!",
      });
      onSuccess();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {type === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="datemate-input"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="datemate-input"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="datemate-input"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={loading}
        className="datemate-button-primary w-full mt-6"
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {type === 'login' ? 'Logging in...' : 'Creating account...'}
          </span>
        ) : (
          <>{type === 'login' ? 'Login' : 'Create Account'}</>
        )}
      </Button>
    </form>
  );
};

export default AuthForm;
