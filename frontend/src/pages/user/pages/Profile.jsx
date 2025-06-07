import React, { useEffect, useState } from 'react';
import ProfileLeftSection from '../components/ProfileLeftSection';
import ProfileRightSection from '../components/ProfileRightSection';

import { useParams } from 'react-router-dom';
import { authAPI } from '@/api/api';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton'; 


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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Skeleton for Left Section */}
          <div className="md:col-span-1 space-y-6">
             <Skeleton className="h-64 w-full" /> {/* Skeleton for User Details Card */}
             <Skeleton className="h-80 w-full" /> {/* Skeleton for Statistics Card */}
             <Skeleton className="h-40 w-full" /> {/* Skeleton for Ranking Card */}
          </div>
          {/* Skeleton for Right Section */}
          <div className="md:col-span-2 space-y-6">
             <Skeleton className="h-32 w-full" /> {/* Skeleton for Activity Streak */}
             <Skeleton className="h-64 w-full" /> {/* Skeleton for Solved Problems Table */}
             <Skeleton className="h-64 w-full" /> {/* Skeleton for Recent Submissions Table */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-1 space-y-6">
         
          <ProfileLeftSection userId={userId} userDetails={userDetails} isOwnProfile={isOwnProfile} />
         
        </div>
        <div className="md:col-span-2 space-y-6">
        
          <ProfileRightSection userId={userId} userDetails={userDetails} isOwnProfile={isOwnProfile} />
        </div>
      </div>
    </div>
  );
};

export default Profile;