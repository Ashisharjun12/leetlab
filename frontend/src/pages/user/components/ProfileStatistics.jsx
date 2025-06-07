import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart2, Percent, Trophy, Code, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { userAPI } from '@/api/api'; // Import userAPI
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component
import { motion } from 'framer-motion';

const ProfileStatistics = ({ userId }) => {
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
        setIsLoading(false);
        return;
    }

    const fetchUserStats = async () => {
      setIsLoading(true);
      try {
        const response = await userAPI.getUserStats(userId);
        console.log("Fetched user stats in ProfileStatistics:", response.data.data);
        if (response.data.success) {
          setUserStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user stats in ProfileStatistics:", error);
        setUserStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();

  }, [userId]);

  const problemsSolved = userStats?.totalSolved || 0;
  const totalSubmissions = userStats?.totalSubmissions || 0;
  const solvedByDifficulty = userStats?.solvedByDifficulty || {};
  const solvedByLanguage = userStats?.solvedByLanguage || {};

  // Calculate acceptance rate
  const acceptanceRate = totalSubmissions > 0
    ? ((problemsSolved / totalSubmissions) * 100).toFixed(1)
    : 'N/A';

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2 px-6">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-500" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-6 px-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-background/50 rounded-lg border border-border/50">
              <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg border border-border/50">
              <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          </div>

          <div className="text-center p-4 bg-background/50 rounded-lg border border-border/50">
            <Skeleton className="h-4 w-1/3 mx-auto mb-2" />
            <Skeleton className="h-6 w-1/4 mx-auto" />
          </div>

          <div className="text-center flex flex-col items-center space-y-2">
            <Skeleton className="h-4 w-1/3 mx-auto" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <div className="flex justify-center gap-4 mt-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>

          <div className="text-center flex flex-col items-center space-y-2">
            <Skeleton className="h-4 w-1/3 mx-auto" />
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userStats) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Could not load statistics.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2 px-6">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-blue-500" />
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-6 px-6">
        <motion.div 
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center p-4 bg-background/50 rounded-lg border border-border/50 hover:bg-background/80 transition-colors">
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold">{problemsSolved}</h3>
            <p className="text-sm text-muted-foreground">Problems Solved</p>
          </div>
          <div className="text-center p-4 bg-background/50 rounded-lg border border-border/50 hover:bg-background/80 transition-colors">
            <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold">{totalSubmissions}</h3>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
          </div>
        </motion.div>

        <motion.div 
          className="text-center p-4 bg-background/50 rounded-lg border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Percent className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Acceptance Rate</p>
          <h3 className="text-2xl font-bold flex items-center justify-center gap-1">
            {acceptanceRate}{acceptanceRate !== 'N/A' && '%'}
          </h3>
        </motion.div>

        <motion.div 
          className="text-center flex flex-col items-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-sm text-muted-foreground">Solved by Difficulty</p>
          {Object.keys(solvedByDifficulty).length > 0 ? (
            <div className="flex flex-col items-center justify-center w-full">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={Object.keys(solvedByDifficulty).map(key => ({ name: key, value: solvedByDifficulty[key] }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={1000}
                  >
                    {Object.keys(solvedByDifficulty).map((key, index) => {
                      const color = {
                        easy: '#22C55E',
                        medium: '#EAB308',
                        hard: '#EF4444',
                      }[key.toLowerCase()] || '#6B7280';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Legend 
                    wrapperStyle={{ 
                      padding: '0',
                      fontSize: '12px',
                      marginTop: '10px',
                    }} 
                    payload={Object.keys(solvedByDifficulty).map(key => ({
                      id: key,
                      value: key.charAt(0).toUpperCase() + key.slice(1),
                      type: 'circle',
                      color: {
                        easy: '#22C55E',
                        medium: '#EAB308',
                        hard: '#EF4444',
                      }[key.toLowerCase()] || '#6B7280',
                    }))}
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-20 text-muted-foreground">
              No difficulty data available.
            </div>
          )}
        </motion.div>

        <motion.div 
          className="text-center flex flex-col items-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">Solved by Language</p>
          {Object.keys(solvedByLanguage).length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              {Object.keys(solvedByLanguage).map(lang => (
                <div 
                  key={lang} 
                  className="flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-full border border-border/50 hover:bg-background/80 transition-colors"
                >
                  <Code className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{lang.toUpperCase()}</span>
                  <span className="text-sm font-medium">{solvedByLanguage[lang]}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-10 text-muted-foreground">
              No language data available.
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ProfileStatistics; 