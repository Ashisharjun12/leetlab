import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart2, Percent } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { userAPI } from '@/api/api'; // Import userAPI
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component

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
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <BarChart2 className="w-4 h-4 text-muted-foreground" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-6">
            {/* Skeleton for Solved Problems and Total Submissions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                 <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
                 <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                 <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
                 <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            </div>

            {/* Skeleton for Acceptance Rate */}
            <div className="text-center">
              <Skeleton className="h-4 w-1/3 mx-auto mb-2" />
              <Skeleton className="h-6 w-1/4 mx-auto" />
            </div>

            {/* Skeleton for Solved by Difficulty Chart */}
            <div className="text-center flex flex-col items-center space-y-2">
               <Skeleton className="h-4 w-1/3 mx-auto" />
               <Skeleton className="h-40 w-full" /> {/* Skeleton for the chart area */}
               <div className="flex justify-center gap-4 mt-2">
                 <Skeleton className="h-4 w-12" />
                 <Skeleton className="h-4 w-12" />
                 <Skeleton className="h-4 w-12" />
               </div>
            </div>

            {/* Skeleton for Solved by Language */}
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
      return <div className="text-center text-muted-foreground">Could not load statistics.</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1">
          <BarChart2 className="w-4 h-4 text-muted-foreground" />
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <h3 className="text-2xl font-bold">{problemsSolved}</h3>
            <p className="text-sm text-muted-foreground">Problems Solved</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <h3 className="text-2xl font-bold">{totalSubmissions}</h3>
            <p className="text-sm text-muted-foreground">Total Submissions</p>
          </div>
        </div>

        {/* Acceptance Rate */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Acceptance Rate</p>
          <h3 className="text-xl font-bold flex items-center justify-center gap-1">
             {acceptanceRate}{acceptanceRate !== 'N/A' && '%'}
          </h3>
           {/* Acceptance Rate Chart Placeholder removed */}
        </div>

         {/* Solved by Difficulty */}
         <div className="text-center flex flex-col items-center space-y-2">
           <p className="text-sm text-muted-foreground">Solved by Difficulty</p>
           {/* Solved by Difficulty Chart */}
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
                       isAnimationActive={false} 
                     >
                       {Object.keys(solvedByDifficulty).map((key, index) => {
                         const color = {
                           easy: '#22C55E', // Green
                           medium: '#EAB308', // Yellow
                           hard: '#EF4444', // Red
                         }[key.toLowerCase()] || '#6B7280';
                         return <Cell key={`cell-${index}`} fill={color} />;
                       })}
                     </Pie>
                     {/* Legend */}
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
                             easy: '#22C55E', // Green
                             medium: '#EAB308', // Yellow
                             hard: '#EF4444', // Red
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
         </div>

          {/* Solved by Language */}
          <div className="text-center flex flex-col items-center space-y-2">
             <p className="text-sm text-muted-foreground">Solved by Language</p>
             {Object.keys(solvedByLanguage).length > 0 ? (
               <div className="flex flex-wrap items-center justify-center h-auto text-muted-foreground mt-2 gap-4">
                 {Object.keys(solvedByLanguage).map(lang => (
                    <div key={lang} className="flex items-center gap-1">
                       <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                       <span>{lang.toUpperCase()}: {solvedByLanguage[lang]}</span>
                    </div>
                 ))}
               </div>
             ) : (
               <div className="flex items-center justify-center h-10 text-muted-foreground">
                  No language data available.
               </div>
             )}
          </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStatistics; 