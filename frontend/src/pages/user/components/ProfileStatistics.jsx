import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart2, Percent } from 'lucide-react';

const ProfileStatistics = ({ userDetails }) => {
  const problemsSolved = userDetails?.problemsSolved || 0;
  const totalSubmissions = userDetails?.submissions || 0;
  const solvedByDifficulty = userDetails?.solvedByDifficulty || {}; // Assuming this structure from backend
  const solvedByLanguage = userDetails?.solvedByLanguage || {};   // Assuming this structure from backend

  // Calculate acceptance rate
  const acceptanceRate = totalSubmissions > 0 
    ? ((problemsSolved / totalSubmissions) * 100).toFixed(1)
    : 'N/A';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1">
          <BarChart2 className="w-4 h-4 text-muted-foreground" />
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
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
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Acceptance Rate</p>
            <h3 className="text-xl font-bold flex items-center justify-center gap-1">
               {acceptanceRate}{acceptanceRate !== 'N/A' && '%'}
               {acceptanceRate !== 'N/A' && <Percent className="w-5 h-5" />} 
            </h3>
             {/* Acceptance Rate Chart Placeholder (Doughnut/Pie chart style) */}
             <div className="flex items-center justify-center h-20 text-muted-foreground">
                 {/* Chart can go here if using a library */}
                 Circle Chart Placeholder
             </div>
          </div>
           
           {/* Solved by Difficulty */}
           <div className="text-center">
             <p className="text-sm text-muted-foreground">Solved by Difficulty</p>
             {/* Solved by Difficulty Chart or List */}
             {Object.keys(solvedByDifficulty).length > 0 ? (
                <div className="flex items-center justify-center h-20 text-muted-foreground">
                  {/* Render chart or list based on solvedByDifficulty */}
                  <p>Data available (e.g., Easy: {solvedByDifficulty.easy || 0}, Medium: {solvedByDifficulty.medium || 0}, Hard: {solvedByDifficulty.hard || 0})</p>
                </div>
             ) : (
                <div className="flex items-center justify-center h-20 text-muted-foreground">
                   Chart Placeholder
                </div>
             )}
              {/* Difficulty Legend Placeholder */}
              {Object.keys(solvedByDifficulty).length > 0 && (
                 <div className="flex items-center justify-center gap-2 text-xs mt-2 text-muted-foreground">
                   {/* Render legend based on solvedByDifficulty keys */}
                   {Object.keys(solvedByDifficulty).map(diff => (
                      <span key={diff} className="capitalize">{diff}</span>
                   ))}
                 </div>
              )}
           </div>

            {/* Solved by Language */}
            <div className="text-center">
               <p className="text-sm text-muted-foreground">Solved by Language</p>
               {/* Solved by Language List/Chart */}
               {Object.keys(solvedByLanguage).length > 0 ? (
                 <div className="flex items-center justify-center h-10 text-muted-foreground">
                   {/* Render list or chart based on solvedByLanguage */}
                   <p>Data available (e.g., {Object.keys(solvedByLanguage).map(lang => `${lang}: ${solvedByLanguage[lang]}`).join(', ')})</p>
                 </div>
               ) : (
                 <div className="flex items-center justify-center h-10 text-muted-foreground">
                    List/Chart Placeholder
                 </div>
               )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStatistics; 