
import { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, Calendar, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { HeatmapModal } from '@/components/HeatmapModal';

interface HabitCompletion {
  date: string;
  completed: boolean;
  completionTime?: string;
}

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
  frequency: string;
  customDays?: string[];
  completions?: HabitCompletion[];
}

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'all'>('pending');

  // Load habits from localStorage on component mount
  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (newHabit: Omit<Habit, 'id' | 'streak' | 'completedToday' | 'totalDays' | 'completedDays' | 'completions'>) => {
    const habit: Habit = {
      ...newHabit,
      id: Date.now().toString(),
      streak: 0,
      completedToday: false,
      totalDays: 1,
      completedDays: 0,
      completions: []
    };
    setHabits(prev => [...prev, habit]);
  };

  const toggleHabitCompletion = (habitId: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const newCompletedToday = !habit.completedToday;
        const newCompletedDays = newCompletedToday ? habit.completedDays + 1 : Math.max(0, habit.completedDays - 1);
        const newTotalDays = Math.max(habit.totalDays, newCompletedDays);
        
        // Update completions array
        const completions = habit.completions || [];
        const existingCompletionIndex = completions.findIndex(c => c.date === today);
        
        let updatedCompletions;
        if (existingCompletionIndex >= 0) {
          // Update existing completion
          updatedCompletions = [...completions];
          updatedCompletions[existingCompletionIndex] = {
            ...updatedCompletions[existingCompletionIndex],
            completed: newCompletedToday,
            completionTime: newCompletedToday ? currentTime : undefined
          };
        } else {
          // Add new completion
          updatedCompletions = [...completions, {
            date: today,
            completed: newCompletedToday,
            completionTime: newCompletedToday ? currentTime : undefined
          }];
        }
        
        return {
          ...habit,
          completedToday: newCompletedToday,
          completedDays: newCompletedDays,
          totalDays: newTotalDays,
          streak: newCompletedToday ? habit.streak + 1 : 0,
          completions: updatedCompletions
        };
      }
      return habit;
    }));
  };

  const openHeatmap = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsHeatmapOpen(true);
  };

  // Calculate real statistics based on actual habit data
  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const currentStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const totalCheckIns = habits.reduce((sum, h) => sum + h.completedDays, 0);

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
                  <p className="text-sm text-gray-500">Today's completion rate</p>
                </div>
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Best Streak</p>
                  <p className="text-3xl font-bold">{currentStreak} days</p>
                  <p className="text-sm text-gray-500">Longest current streak</p>
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
                  <p className="text-sm text-gray-500">All time completions</p>
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
            <p className="text-gray-500">
              {totalHabits === 0 ? 'No habits created yet. Click "Add New Habit" to get started!' : 'No habits found in this category'}
            </p>
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
                          <Badge variant="outline">{habit.frequency}</Badge>
                          <span>{habit.completedDays}/{habit.totalDays} completed</span>
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openHeatmap(habit)}
                      >
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

        {selectedHabit && (
          <HeatmapModal
            open={isHeatmapOpen}
            onOpenChange={setIsHeatmapOpen}
            habit={selectedHabit}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
