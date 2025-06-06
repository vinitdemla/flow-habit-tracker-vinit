import { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, Calendar, Trophy, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { StatsCard } from '@/components/StatsCard';
import { HabitTemplates } from '@/components/HabitTemplates';
import { ExportData } from '@/components/ExportData';
import { Goals } from '@/components/Goals';
import { HabitReminders } from '@/components/HabitReminders';
import { HabitAnalytics } from '@/components/HabitAnalytics';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface HabitCompletion {
  date: string;
  completed: boolean;
  completionTime?: string;
  note?: string;
}

interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
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
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'all'>('pending');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [completionNote, setCompletionNote] = useState('');

  // Initialize today's date tracking and load habits
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      const parsedHabits = JSON.parse(storedHabits);
      
      const updatedHabits = parsedHabits.map((habit: Habit) => {
        const completions = habit.completions || [];
        
        // Ensure today's entry exists
        const hasToday = completions.some(c => c.date === today);
        if (!hasToday) {
          completions.push({
            date: today,
            completed: false
          });
        }
        
        // Update completedToday status
        const todayCompletion = completions.find(c => c.date === today);
        const completedToday = todayCompletion?.completed || false;
        
        // Recalculate streak properly
        let streak = 0;
        if (completedToday) {
          const sortedCompletions = completions
            .filter(c => c.completed)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          for (let i = 0; i < sortedCompletions.length; i++) {
            const completionDate = new Date(sortedCompletions[i].date);
            const expectedDate = new Date(today);
            expectedDate.setDate(expectedDate.getDate() - i);
            
            if (completionDate.toDateString() === expectedDate.toDateString()) {
              streak++;
            } else {
              break;
            }
          }
        }
        
        // Recalculate completed days
        const completedDays = completions.filter(c => c.completed).length;
        
        return {
          ...habit,
          completions,
          completedToday,
          streak,
          completedDays,
          totalDays: Math.max(completions.length, habit.totalDays || 1)
        };
      });
      
      setHabits(updatedHabits);
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  const addHabit = (newHabit: {
    name: string;
    description: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    icon: string;
    frequency: string;
    customDays?: string[];
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const habit: Habit = {
      ...newHabit,
      id: Date.now().toString(),
      streak: 0,
      completedToday: false,
      totalDays: 1,
      completedDays: 0,
      completions: [{
        date: today,
        completed: false
      }]
    };
    setHabits(prev => [...prev, habit]);
  };

  const addHabitFromTemplate = (template: any) => {
    addHabit(template);
  };

  const showHabitDetails = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsDetailsDialogOpen(true);
  };

  const toggleHabitCompletion = (habitId: string, note?: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const newCompletedToday = !habit.completedToday;
        
        // Update completions array
        const completions = [...(habit.completions || [])];
        const existingCompletionIndex = completions.findIndex(c => c.date === today);
        
        if (existingCompletionIndex >= 0) {
          completions[existingCompletionIndex] = {
            ...completions[existingCompletionIndex],
            completed: newCompletedToday,
            completionTime: newCompletedToday ? currentTime : undefined,
            note: newCompletedToday ? note : undefined
          };
        } else {
          completions.push({
            date: today,
            completed: newCompletedToday,
            completionTime: newCompletedToday ? currentTime : undefined,
            note: newCompletedToday ? note : undefined
          });
        }
        
        // Recalculate completed days
        const newCompletedDays = completions.filter(c => c.completed).length;
        
        // Calculate streak properly
        let newStreak = 0;
        if (newCompletedToday) {
          const sortedCompletions = completions
            .filter(c => c.completed)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          for (let i = 0; i < sortedCompletions.length; i++) {
            const completionDate = new Date(sortedCompletions[i].date);
            const expectedDate = new Date(today);
            expectedDate.setDate(expectedDate.getDate() - i);
            
            if (completionDate.toDateString() === expectedDate.toDateString()) {
              newStreak++;
            } else {
              break;
            }
          }
        }
        
        return {
          ...habit,
          completedToday: newCompletedToday,
          completedDays: newCompletedDays,
          totalDays: Math.max(completions.length, habit.totalDays),
          streak: newStreak,
          completions
        };
      }
      return habit;
    }));
  };

  const handleCompleteWithNote = (habitId: string) => {
    toggleHabitCompletion(habitId, completionNote);
    setCompletionNote('');
  };

  // Calculate simplified statistics
  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const currentStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  const getDisplayedHabits = () => {
    let filtered = habits;
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(h => h.category === categoryFilter);
    }
    
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(h => h.difficulty === difficultyFilter);
    }
    
    switch (activeTab) {
      case 'pending':
        return filtered.filter(h => !h.completedToday);
      case 'completed':
        return filtered.filter(h => h.completedToday);
      case 'all':
        return filtered;
      default:
        return filtered.filter(h => !h.completedToday);
    }
  };

  const displayedHabits = getDisplayedHabits();
  const categories = ['all', ...Array.from(new Set(habits.map(h => h.category)))];
  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard
            title="Total Habits"
            value={totalHabits.toString()}
            icon={<Target className="h-5 w-5 sm:h-6 sm:w-6" />}
            description="Active habits tracked"
            gradient="from-blue-500 to-blue-600"
          />
          
          <StatsCard
            title="Completed Today"
            value={`${completedToday}/${totalHabits}`}
            icon={<Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
            description="Daily progress"
            gradient="from-green-500 to-green-600"
          />

          <StatsCard
            title="Best Streak"
            value={`${currentStreak}`}
            icon={<Trophy className="h-5 w-5 sm:h-6 sm:w-6" />}
            description="Days in a row"
            gradient="from-yellow-500 to-orange-500"
          />
        </div>

        {/* Enhanced Features Tabs - Removed Achievements */}
        <Tabs defaultValue="habits" className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="habits" className="space-y-6">
            {/* Your Habits Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">Your Habits</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <HabitTemplates onSelectTemplate={addHabitFromTemplate} />
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Habit
                </Button>
              </div>
            </div>

            {/* Enhanced Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex space-x-4 sm:space-x-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-2 flex-1">
                <button 
                  className={`pb-2 border-b-2 font-medium whitespace-nowrap text-sm sm:text-base transition-colors ${
                    activeTab === 'pending' 
                      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setActiveTab('pending')}
                >
                  Pending ({habits.filter(h => !h.completedToday).length})
                </button>
                <button 
                  className={`pb-2 border-b-2 font-medium whitespace-nowrap text-sm sm:text-base transition-colors ${
                    activeTab === 'completed' 
                      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed ({habits.filter(h => h.completedToday).length})
                </button>
                <button 
                  className={`pb-2 border-b-2 font-medium whitespace-nowrap text-sm sm:text-base transition-colors ${
                    activeTab === 'all' 
                      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setActiveTab('all')}
                >
                  All ({totalHabits})
                </button>
              </div>
              
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty === 'all' ? 'All' : difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Habits List */}
            {displayedHabits.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  {totalHabits === 0 ? 'No habits created yet. Click "Add New Habit" to get started!' : 'No habits found with current filters'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {displayedHabits.map((habit) => (
                  <Card key={habit.id} className={`hover:shadow-md transition-all duration-200 ${
                    habit.completedToday ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'hover:shadow-lg'
                  }`}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                          <div className="text-xl sm:text-2xl">{habit.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg truncate text-gray-900 dark:text-gray-100">{habit.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <span className="flex items-center">
                                <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                {habit.streak} day streak
                              </span>
                              <Badge variant="outline" className="text-xs">{habit.frequency}</Badge>
                              <Badge className={getDifficultyColor(habit.difficulty)}>{habit.difficulty}</Badge>
                              <span className="hidden sm:inline">{habit.completedDays}/{habit.totalDays} completed</span>
                            </div>
                            <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {habit.completedDays}/{habit.totalDays} completed ({Math.round((habit.completedDays / Math.max(habit.totalDays, 1)) * 100)}%)
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
                          <Button 
                            onClick={() => showHabitDetails(habit)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Details
                          </Button>
                          {!habit.completedToday && activeTab !== 'completed' && (
                            <Button 
                              onClick={() => toggleHabitCompletion(habit.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none"
                              size="sm"
                            >
                              Complete
                            </Button>
                          )}
                          {habit.completedToday && (
                            <Badge className="bg-green-600 text-white">✓ Completed</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="goals">
            <Goals habits={habits} onAddHabit={addHabit} />
          </TabsContent>

          <TabsContent value="analytics">
            <HabitAnalytics habits={habits} />
          </TabsContent>

          <TabsContent value="reminders">
            <HabitReminders habits={habits} />
          </TabsContent>

          <TabsContent value="export">
            <ExportData habits={habits} />
          </TabsContent>
        </Tabs>

        <AddHabitDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddHabit={addHabit}
        />

        {/* Habit Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-2xl">{selectedHabit?.icon}</span>
                {selectedHabit?.name} Details
              </DialogTitle>
            </DialogHeader>
            {selectedHabit && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Current Streak:</strong> {selectedHabit.streak} days
                  </div>
                  <div>
                    <strong>Total Completed:</strong> {selectedHabit.completedDays}/{selectedHabit.totalDays}
                  </div>
                  <div>
                    <strong>Success Rate:</strong> {Math.round((selectedHabit.completedDays / Math.max(selectedHabit.totalDays, 1)) * 100)}%
                  </div>
                  <div>
                    <strong>Category:</strong> {selectedHabit.category}
                  </div>
                </div>
                
                {selectedHabit.description && (
                  <div>
                    <strong>Description:</strong>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedHabit.description}</p>
                  </div>
                )}

                <div>
                  <strong>Recent Activity:</strong>
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {selectedHabit.completions?.slice(-10).reverse().map((completion, index) => (
                      <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span>{new Date(completion.date).toLocaleDateString()}</span>
                        <span className={completion.completed ? 'text-green-600' : 'text-gray-400'}>
                          {completion.completed ? '✓ Completed' : '○ Pending'}
                          {completion.completionTime && ` at ${completion.completionTime}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {!selectedHabit.completedToday && (
                  <div className="space-y-3 pt-4 border-t">
                    <Label htmlFor="completion-note">Add a note (optional):</Label>
                    <Textarea
                      id="completion-note"
                      placeholder="How did it go? Any thoughts?"
                      value={completionNote}
                      onChange={(e) => setCompletionNote(e.target.value)}
                      rows={3}
                    />
                    <Button 
                      onClick={() => {
                        handleCompleteWithNote(selectedHabit.id);
                        setIsDetailsDialogOpen(false);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Complete Habit
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
