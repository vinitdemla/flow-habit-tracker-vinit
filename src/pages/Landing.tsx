
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
      description: "Build consistency with our intuitive habit tracking tools designed for your lifestyle."
    },
    {
      title: "Beautiful habit heatmaps", 
      description: "Visualize your progress with stunning heatmaps that show your habit completion patterns."
    },
    {
      title: "Detailed analytics and insights",
      description: "Get comprehensive insights into your habits with detailed analytics and progress reports."
    },
    {
      title: "Custom notifications",
      description: "Stay on track with personalized reminders and notifications for your habits."
    },
    {
      title: "Progress tracking",
      description: "Monitor your journey with advanced progress tracking and streak counters."
    },
    {
      title: "Goal setting",
      description: "Set meaningful goals and track your achievements with our goal-setting tools."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="w-full p-4 sm:p-6 flex justify-between items-center">
        <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
          HabitRise
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/signin')}
          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 border-blue-600 dark:border-blue-600"
        >
          Sign In
        </Button>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 sm:py-16 text-center">
        <Badge variant="secondary" className="mb-6 sm:mb-8 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
          Beta Release
        </Badge>
        
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
          <span className="text-gray-900 dark:text-gray-100">Build better</span><br />
          <span className="text-gray-900 dark:text-gray-100">habits, </span>
          <span className="text-blue-600 dark:text-blue-400">one day at</span><br />
          <span className="text-blue-600 dark:text-blue-400">a time</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
          HabitRise helps you create and maintain positive habits through beautiful 
          visualizations and smart tracking. Start your journey to a better you today.
        </p>

        <Button 
          size="lg" 
          onClick={() => navigate('/signin')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Get Started →
        </Button>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm sm:text-base">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400 text-xs sm:text-sm px-4">
        built by <span className="text-blue-600 dark:text-blue-400">vinit</span> using{' '}
        <span className="text-blue-600 dark:text-blue-400">supabase</span> and{' '}
        <span className="text-blue-600 dark:text-blue-400">lovable</span>
      </footer>
    </div>
  );
};

export default Landing;
