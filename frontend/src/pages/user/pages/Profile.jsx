import React, { useEffect, useState } from 'react';
import ProfileLeftSection from '../components/ProfileLeftSection';
import ProfileRightSection from '../components/ProfileRightSection';
import TopProfileSection from '../components/TopProfileSection';
import { useParams } from 'react-router-dom';
import { authAPI } from '@/api/api';
import { useAuthStore } from '@/store/authStore';
// import ProfileStatistics from '../components/ProfileStatistics'; // Removed as ProfileStatistics is now rendered inside ProfileLeftSection

const Profile = () => {
  const { userId } = useParams();
  const { authUser } = useAuthStore();
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isOwnProfile = authUser?.id === userId;

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userId) {
        try {
          const response = await authAPI.getUserDetails(userId);
          setUserDetails(response.data.data);
        } catch (error) {
          console.error("Failed to fetch user details in Profile page:", error);
          setUserDetails(null);
        } finally {
          setIsLoading(false);
        }
      } else if (authUser) {
         // If no userId in params, show logged-in user's profile
         setUserDetails(authUser);
         setIsLoading(false);
      } else {
         setIsLoading(false);
      }
    };
    
    fetchUserDetails();

  }, [userId, authUser]);

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* TopProfileSection is no longer used here as its content is now in ProfileLeftSection */}
      {/* <TopProfileSection userDetails={userDetails} isOwnProfile={isOwnProfile} /> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-1 space-y-6">
          {/* ProfileLeftSection now contains User Details, Statistics, and Ranking */}
          <ProfileLeftSection userDetails={userDetails} isOwnProfile={isOwnProfile} />
           {/* ProfileStatistics is now rendered inside ProfileLeftSection, removed direct usage here */}
           {/* <ProfileStatistics userDetails={userDetails} /> */}
          {/* Ranking Section Placeholder is now inside ProfileLeftSection, removed direct usage here */}
          {/* <div className="h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
             Ranking Placeholder
          </div> */}
        </div>
        <div className="md:col-span-2 space-y-6">
          {/* ProfileRightSection contains Activity Streak, Solved Problems, and Recent Submissions */}
          {/* Pass userDetails to ProfileRightSection if needed for statistics/activity data */}
          <ProfileRightSection userId={userId} userDetails={userDetails} isOwnProfile={isOwnProfile} />
        </div>
      </div>
    </div>
  );
};

export default Profile;