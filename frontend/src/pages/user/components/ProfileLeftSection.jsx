import React from 'react';
import ProfileStatistics from './ProfileStatistics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, CalendarDays, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const ProfileLeftSection = ({ userDetails, isOwnProfile }) => {
  // userDetails is passed from Profile.jsx
  
  const joinedDate = userDetails?.createdAt ? format(new Date(userDetails.createdAt), 'dd/MM/yyyy') : 'N/A';
  const userRank = userDetails?.rank !== undefined ? `#${userDetails.rank}` : 'N/A'; // Assuming rank is a number
  const userPercentile = userDetails?.percentile !== undefined ? `${userDetails.percentile.toFixed(1)}%` : 'N/A'; // Assuming percentile is a number
  const totalUsers = userDetails?.totalUsers !== undefined ? userDetails.totalUsers : 'N/A'; // Assuming totalUsers is a number

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      // Add your image upload API call here
      // On success, you might want to refetch user details or update the avatar in the store
      console.log('Uploading image...', file);
      // toast.success("Profile image updated successfully");
    } catch (error) {
      console.error("Failed to update profile image:", error);
      // toast.error("Failed to update profile image");
    }
  };

  return (
    <div className="space-y-6">
      {/* User Details Card - Matches Top Section in image */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userDetails?.avatar} alt={userDetails?.name} />
              <AvatarFallback>{userDetails?.name ? userDetails.name[0].toUpperCase() : 'MD'}</AvatarFallback>
            </Avatar>
             {/* Image upload overlay */}
            {isOwnProfile && (
              <label htmlFor="avatarUpload" className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 cursor-pointer rounded-full transition-opacity">
                 <Upload className="w-6 h-6 text-white" />
                 <input
                  id="avatarUpload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{userDetails?.name || 'User'}</h2>
              {isOwnProfile && (
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  Edit Profile
                </Button>
              )}
            </div>
            <div className="text-muted-foreground text-sm flex items-center gap-1">
              <CalendarDays className="w-4 h-4"/>
              <span>Joined on {joinedDate}</span>
            </div>
             {/* Role badge - if needed */}
             {/* {userDetails?.role && (
                <Badge variant="secondary" className="mt-2">
                   {userDetails.role}
                </Badge>
             )} */}
          </div>
        </div>
      </Card>

      {/* Profile Statistics Card */}
      {/* userDetails is passed down to ProfileStatistics */}
      <ProfileStatistics userDetails={userDetails} />

      {/* Ranking Section */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Trophy className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Ranking</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
         <div className="grid grid-cols-3 gap-4 text-center mt-4">
            <div>
               <h3 className="text-xl font-bold">{userRank}</h3>
               <p className="text-sm text-muted-foreground">Your Rank</p>
            </div>
             <div>
               <h3 className="text-xl font-bold">{userPercentile}</h3>
               <p className="text-sm text-muted-foreground">Percentile</p>
            </div>
             <div>
               <h3 className="text-xl font-bold">{totalUsers}</h3>
               <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileLeftSection;