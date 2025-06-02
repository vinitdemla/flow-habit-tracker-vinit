
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Track daily, weekly, or custom habits",
      description: "Experience the power of consistent habit tracking with our intuitive tools."
    },
    {
      title: "Beautiful habit heatmaps", 
      description: "Experience the power of consistent habit tracking with our intuitive tools."
    },
    {
      title: "Detailed analytics and insights",
      description: "Experience the power of consistent habit tracking with our intuitive tools."
    },
    {
      title: "Custom notifications",
      description: "Experience the power of consistent habit tracking with our intuitive tools."
    },
    {
      title: "Progress tracking",
      description: "Experience the power of consistent habit tracking with our intuitive tools."
    },
    {
      title: "Goal setting",
      description: "Experience the power of consistent habit tracking with our intuitive tools."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">HabitFlow</div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/signin')}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Sign In
        </Button>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="mb-8 bg-blue-100 text-blue-800">
          Beta Release
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-8">
          <span className="text-gray-900">Build better</span><br />
          <span className="text-gray-900">habits, </span>
          <span className="text-blue-600">one day at</span><br />
          <span className="text-blue-600">a time</span>
        </h1>

        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          HabitFlow helps you create and maintain positive habits through beautiful 
          visualizations and smart tracking. Start your journey to a better you today.
        </p>

        <Button 
          size="lg" 
          onClick={() => navigate('/signin')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
        >
          Get Started →
        </Button>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        built by <span className="text-blue-600">ashish</span> using{' '}
        <span className="text-blue-600">supabase</span> and{' '}
        <span className="text-blue-600">lovable</span>
      </footer>
    </div>
  );
};

export default Landing;
