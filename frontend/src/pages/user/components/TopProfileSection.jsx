import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

const TopProfileSection = ({ userDetails, isOwnProfile }) => {
  const joinedDate = userDetails?.createdAt ? format(new Date(userDetails.createdAt), 'dd/MM/yyyy') : 'N/A';

  return (
    <Card className="p-6 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src={userDetails?.avatar} alt={userDetails?.name} />
          <AvatarFallback>{userDetails?.name ? userDetails.name[0].toUpperCase() : 'MD'}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{userDetails?.name || 'User'}</h2>
          <div className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
            <CalendarDays className="w-4 h-4"/>
            <span>Joined on {joinedDate}</span>
          </div>
        </div>
      </div>
      {isOwnProfile && (
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          Edit Profile
        </Button>
      )}
    </Card>
  );
};

export default TopProfileSection;
