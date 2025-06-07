import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CalendarDays, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const TopProfileSection = ({ userDetails, isOwnProfile }) => {
  const joinedDate = userDetails?.createdAt ? format(new Date(userDetails.createdAt), 'dd/MM/yyyy') : 'N/A';

  return (
    <motion.div
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                    <AvatarImage src={userDetails?.avatar} alt={userDetails?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
                      {userDetails?.name ? userDetails.name[0].toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

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

              {isOwnProfile && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
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
        </div>
      </Card>
    </motion.div>
  );
};

export default TopProfileSection;
