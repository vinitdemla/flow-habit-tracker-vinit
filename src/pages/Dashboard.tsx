
import { useState } from 'react';
import { Plus, Target, TrendingUp, Calendar, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { AddHabitDialog } from '@/components/AddHabitDialog';

interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  streak: number;
  completedToday: boolean;
  totalDays: number;
  completedDays: number;
  icon: string;
}

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'STOP MASTURBATION',
      description: 'Build self-control and focus',
      category: 'Health',
      streak: 1,
      completedToday: false,
      totalDays: 14,
      completedDays: 2,
      icon: '💪'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'all'>('pending');

  const addHabit = (newHabit: Omit<Habit, 'id' | 'streak' | 'completedToday' | 'totalDays' | 'completedDays'>) => {
    const habit: Habit = {
      ...newHabit,
      id: Date.now().toString(),
      streak: 0,
      completedToday: false,
      totalDays: 0,
      completedDays: 0
    };
    setHabits(prev => [...prev, habit]);
  };

  const toggleHabitCompletion = (habitId: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newCompletedToday = !habit.completedToday;
        return {
          ...habit,
          completedToday: newCompletedToday,
          completedDays: newCompletedToday ? habit.completedDays + 1 : Math.max(0, habit.completedDays - 1),
          totalDays: habit.totalDays + (newCompletedToday ? 1 : 0),
          streak: newCompletedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    }));
  };

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 14;
  const currentStreak = Math.max(...habits.map(h => h.streak), 1);
  const totalCheckIns = habits.reduce((sum, h) => sum + h.completedDays, 1);

  const pendingHabits = habits.filter(h => !h.completedToday);
  const completedHabits = habits.filter(h => h.completedToday);

  const getDisplayedHabits = () => {
    switch (activeTab) {
      case 'pending':
        return pendingHabits;
      case 'completed':
        return completedHabits;
      case 'all':
        return habits;
      default:
        return pendingHabits;
    }
  };

  const displayedHabits = getDisplayedHabits();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Habits</p>
                  <p className="text-3xl font-bold">{totalHabits}</p>
                  <p className="text-sm text-gray-500">Active habits being tracked</p>
                </div>
                <Target className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                  <p className="text-3xl font-bold">{completionRate}%</p>
                  <p className="text-sm text-gray-500">Last 7 days average</p>
                </div>
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Streak</p>
                  <p className="text-3xl font-bold">{currentStreak} days</p>
                  <p className="text-sm text-gray-500">Current streak</p>
                </div>
                <Trophy className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Check-ins</p>
                  <p className="text-3xl font-bold">{totalCheckIns}</p>
                  <p className="text-sm text-gray-500">All time check-ins</p>
                </div>
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Your Habits Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Habits</h2>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Habit
          </Button>
        </div>

        {/* Habit Tabs */}
        <div className="flex space-x-8 mb-6 border-b">
          <button 
            className={`pb-2 border-b-2 font-medium ${
              activeTab === 'pending' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Today ({pendingHabits.length})
          </button>
          <button 
            className={`pb-2 border-b-2 font-medium ${
              activeTab === 'completed' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({completedHabits.length})
          </button>
          <button 
            className={`pb-2 border-b-2 font-medium ${
              activeTab === 'all' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All ({totalHabits})
          </button>
        </div>

        {/* Habits List */}
        {displayedHabits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No habits found in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedHabits.map((habit) => (
              <Card key={habit.id} className={`hover:shadow-md transition-shadow ${
                habit.completedToday ? 'bg-green-50 border-green-200' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{habit.icon}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{habit.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Trophy className="h-4 w-4 mr-1" />
                            {habit.streak}
                          </span>
                          <Badge variant="outline">daily</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {!habit.completedToday && activeTab === 'pending' && (
                        <Button 
                          onClick={() => toggleHabitCompletion(habit.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Complete
                        </Button>
                      )}
                      {habit.completedToday && (
                        <Badge className="bg-green-600">Completed</Badge>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AddHabitDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddHabit={addHabit}
        />
      </div>
    </div>
  );
};

export default Dashboard;
