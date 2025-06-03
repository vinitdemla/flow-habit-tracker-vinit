
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, LogOut, Edit2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [userName, setUserName] = useState('Guest User');
  const [userEmail, setUserEmail] = useState('guest@example.com');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load user data from localStorage
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    
    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      localStorage.setItem('userName', tempName.trim());
      setIsEditingName(false);
      toast({
        title: "Name updated",
        description: "Your name has been successfully updated.",
      });
    }
  };

  const handleEditName = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setTempName('');
  };

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.clear();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // Refresh the page to reset the app state
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">Profile</h1>

        {/* Profile Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="dark:bg-gray-800 dark:border-gray-700 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xl text-gray-900 dark:text-gray-100">Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Section */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </Label>
                {isEditingName ? (
                  <div className="flex gap-2">
                    <Input
                      id="name"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      placeholder="Enter your name"
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveName}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{userName}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleEditName}
                      className="dark:text-gray-100 dark:hover:bg-gray-600"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Email Section */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </Label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100">{userEmail}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email cannot be changed in guest mode
                </p>
              </div>

              {/* Account Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Account Actions</h3>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full sm:w-auto flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
