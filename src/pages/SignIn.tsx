
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      toast({
        title: "Missing name",
        description: "Please enter your name to continue.",
        variant: "destructive",
      });
      return;
    }

    // Save user data to localStorage
    localStorage.setItem('userName', name.trim());
    localStorage.setItem('userEmail', 'user@habitflow.com');
    localStorage.setItem('isLoggedIn', 'true');

    toast({
      title: "Welcome to HabitFlow!",
      description: `Hello ${name}, let's start building your habits!`,
    });

    // Navigate to dashboard
    navigate('/dashboard');
  };

  const handleGuestLogin = () => {
    localStorage.setItem('userName', 'Guest User');
    localStorage.setItem('userEmail', 'guest@habitflow.com');
    localStorage.setItem('isLoggedIn', 'true');
    
    toast({
      title: "Welcome Guest!",
      description: "Let's start tracking your habits!",
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-6 left-6">
        <div className="text-2xl font-bold text-blue-600">HabitFlow</div>
      </div>
      
      <div className="absolute top-6 right-6">
        <Button 
          variant="outline" 
          onClick={handleGuestLogin}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Continue as Guest
        </Button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-blue-600 mb-2">
            Welcome to HabitFlow
          </CardTitle>
          <p className="text-gray-600">
            Enter your name to start tracking your habits
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Start My Habit Journey
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Your data will be stored locally in your browser
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
