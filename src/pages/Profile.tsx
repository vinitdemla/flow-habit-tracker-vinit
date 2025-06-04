
import { useState, useEffect } from 'react';
import { User, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [userName, setUserName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'User';
    setUserName(storedName);
    setEditedName(storedName);
  }, []);

  const handleSave = () => {
    if (editedName.trim()) {
      localStorage.setItem('userName', editedName.trim());
      setUserName(editedName.trim());
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your name has been updated successfully.",
      });
    }
  };

  const handleCancel = () => {
    setEditedName(userName);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">Profile</h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-6 w-6" />
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter your name"
                      className="max-w-sm"
                    />
                  ) : (
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {userName}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSave}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Data Storage
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your habit data is stored locally in your browser. This means your data will persist 
                  on this device but won't sync across other devices. To backup your data, you can use 
                  the export feature in the Dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
