import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, CalendarDays, Upload, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import ProfileStatistics from './ProfileStatistics';
import { userAPI } from '@/api/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ProfileLeftSection = ({ userDetails, isOwnProfile, userId, onAvatarUpdate }) => {
  // userDetails is passed from Profile.jsx
  
  const joinedDate = userDetails?.createdAt ? format(new Date(userDetails.createdAt), 'dd/MM/yyyy') : 'N/A';


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await userAPI.uploadAvatar(file);
      if (response.data.success) {
        // Call the callback to update the avatar in the parent component
        if (onAvatarUpdate) {
          onAvatarUpdate(response.data.data.avatar);
        }
        toast.success("Profile image updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update profile image");
      }
    } catch (error) {
      console.error("Failed to update profile image:", error);
      toast.error(error.response?.data?.message || "Failed to update profile image");
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
          
          {/* Content */}
          <div className="relative p-6">
            <div className="flex items-center space-x-6">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                  <AvatarImage src={userDetails?.avatar} alt={userDetails?.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
                    {userDetails?.name ? userDetails.name[0].toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                
                {isOwnProfile && (
                  <label 
                    htmlFor="avatarUpload" 
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 cursor-pointer rounded-full transition-all duration-200 group"
                  >
                    <Upload className="w-6 h-6 text-white transform group-hover:scale-110 transition-transform" />
                    <input
                      id="avatarUpload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </motion.div>

              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {userDetails?.name || 'User'}
                  </h2>
                  <div className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                    <CalendarDays className="w-4 h-4" />
                    <span>Joined on {joinedDate}</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {isOwnProfile && (
              <motion.div 
                className="mt-6 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 hover:bg-background/80 transition-colors px-4 py-2 rounded-full border-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ProfileStatistics userId={userId} />
      </motion.div>
    </motion.div>
  );
};

export default ProfileLeftSection;