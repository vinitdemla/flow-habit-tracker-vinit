
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password || (isSignUp && !name)) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Save user data to localStorage
    localStorage.setItem('userName', name || 'Guest User');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isLoggedIn', 'true');

    toast({
      title: isSignUp ? "Account created!" : "Welcome back!",
      description: `${isSignUp ? 'Account created successfully' : 'Signed in successfully'} as ${name || email}`,
    });

    // Navigate to dashboard
    navigate('/dashboard');
  };

  const handleGuestLogin = () => {
    localStorage.setItem('userName', 'Guest User');
    localStorage.setItem('userEmail', 'guest@example.com');
    localStorage.setItem('isLoggedIn', 'true');
    
    toast({
      title: "Guest access",
      description: "Signed in as guest user",
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
            {isSignUp ? 'Create Account' : 'Welcome to HabitFlow'}
          </CardTitle>
          <p className="text-gray-600">
            {isSignUp ? 'Sign up to start tracking your habits' : 'Sign in to continue tracking your habits'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center mt-6 space-y-2">
            <a href="#" className="text-blue-600 hover:underline text-sm">
              Forgot your password?
            </a>
            <div className="text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
