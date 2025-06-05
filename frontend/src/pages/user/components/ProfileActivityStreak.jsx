import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Flame, Info } from 'lucide-react';
import { submissionAPI } from '@/api/api';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO, startOfYear, endOfYear, eachDayOfInterval, getDay, addDays, startOfWeek, isSameDay, getWeek, getWeeksInMonth, isBefore, isAfter, subYears, endOfWeek, startOfMonth, addMonths, getMonth, getYear, endOfMonth } from 'date-fns';
import ActivityHeatmap from './ActivityHeatmap'; // Import the new component

const ProfileActivityStreak = ({ userId }) => {
   const [streakData, setStreakData] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [selectedRange, setSelectedRange] = useState(String(new Date().getFullYear())); // Default to current year as string
   const [availableYears, setAvailableYears] = useState([]);
   const [totalSubmissions, setTotalSubmissions] = useState(0);

   useEffect(() => {
     const currentYear = new Date().getFullYear();
     // Generate last 5 years including current year
     const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
     setAvailableYears(years.map(String)); // Set available years as strings
      // Set default selected range to the current year as a string after available years are set
      setSelectedRange(String(currentYear));
   }, []);

   useEffect(() => {
     const fetchStreakData = async () => {
       if (!userId) return;
       setIsLoading(true);
       try {
         const year = selectedRange === String(new Date().getFullYear()) ? null : selectedRange; // Pass null for current year to API
         const response = await submissionAPI.getActivityStreakByUserId(userId, year);
         setStreakData(response.data.data);
         setTotalSubmissions(response.data.data.totalSubmissions || 0);
       } catch (error) {
         console.error("Error fetching activity streak:", error);
         toast.error("Failed to fetch activity streak");
         setStreakData(null);
         setTotalSubmissions(0);
       } finally {
         setIsLoading(false);
       }
     };

     fetchStreakData();
   }, [userId, selectedRange]);

   // Helper to determine cell color based on activity count (using Tailwind classes)
   const getActivityColor = (count) => {
     if (count === 0) return 'bg-gray-800'; // No activity (default empty cell color)
     if (count > 0 && count < 3) return 'bg-green-700'; // Low activity (1-2 submissions)
     if (count >= 3 && count < 6) return 'bg-green-600'; // Medium activity (3-5 submissions)
     if (count >= 6 && count < 10) return 'bg-green-500'; // High activity (6-9 submissions)
     if (count >= 10) return 'bg-green-400'; // Very high activity (10+ submissions)
     return 'bg-gray-800'; // Default for 0 or unexpected
   };

   const getMonthLabels = (startDate, endDate) => {
     const months = [];
     let currentDate = startOfMonth(startDate);
     
     while (currentDate <= endDate) {
       months.push({
         month: format(currentDate, 'MMM'),
         date: new Date(currentDate)
       });
       currentDate = addMonths(currentDate, 1);
     }
     
     return months;
   };

   // Prepare data for the heatmap component
   const renderHeatmapData = () => {
       if (!streakData) return { displayDays: [], weeks: [] };

       let displayStartDate, displayEndDate;
       const today = new Date();

       if (selectedRange === String(today.getFullYear())) {
         // For the current year, display the last 12 months ending around today, aligned to weeks
         displayEndDate = endOfWeek(today, { weekStartsOn: 1 }); // End on the upcoming Sunday
         displayStartDate = startOfWeek(subYears(displayEndDate, 1), { weekStartsOn: 1 }); // Start on the Monday of the week a year before end date
       } else {
         // For a specific year, display the entire year, aligned to weeks
         const year = parseInt(selectedRange, 10);
         displayStartDate = startOfWeek(startOfYear(new Date(year, 0, 1)), { weekStartsOn: 1 }); // Start on the Monday of the week containing Jan 1st
         displayEndDate = endOfWeek(endOfYear(new Date(year, 0, 1)), { weekStartsOn: 1 }); // End on the Sunday of the week containing Dec 31st
       }

       const displayDays = eachDayOfInterval({ start: displayStartDate, end: displayEndDate });

       // Group days by week (horizontal columns)
       const weeks = [];
       let currentWeek = [];
       displayDays.forEach((day, index) => {
           currentWeek.push(day);
           if ((index + 1) % 7 === 0) {
               weeks.push(currentWeek);
               currentWeek = [];
           }
       });
       if (currentWeek.length > 0) {
           // Pad the last week if necessary to have 7 days (for consistent column layout)
           while(currentWeek.length < 7) {
               currentWeek.push(null);
           }
            weeks.push(currentWeek);
       }

       return { displayDays, weeks };
   };

   const { displayDays, weeks } = renderHeatmapData();

   if (isLoading) {
     return (
       <Card>
         <CardHeader>
           <CardTitle className="text-sm font-medium">Activity Streak</CardTitle>
         </CardHeader>
         <CardContent>
           <div>Loading activity streak...</div>
         </CardContent>
       </Card>
     );
   }

   // Handle case where streakData is null or empty after loading
   if (!streakData) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Activity Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">No activity streak data available.</div>
          </CardContent>
        </Card>
      );
   }

   return (
     <Card>
       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6"> {/* Added px-6 for padding */}
         {/* Flame icon and Activity Streak title */}
         <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" /> {/* Orange fire icon */}
            <CardTitle className="text-sm font-medium">Activity Streak</CardTitle>
         </div>

          {/* Streak numbers and Year/Range Selection */}
          <div className="flex items-center gap-4"> {/* Flex container for streak numbers and select */}
            {/* Total active days and Max streak */}
             <div className="flex items-center text-sm text-muted-foreground gap-4"> {/* Flex for streak numbers */}
               <span>Total active days: <span className="font-semibold text-foreground">{streakData.totalActiveDays}</span></span>
               <span>Max streak: <span className="font-semibold text-foreground">{streakData.longestStreak}</span></span>
               {/* Removed Current Streak here as per new image */} 
             </div>
              {/* Year/Range Selection - Using Select for now, could be a custom range selector */}
            <Select onValueChange={(value) => setSelectedRange(value)} value={selectedRange}>
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                {/* Removed the separate 'current' SelectItem to avoid duplicates */}
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>
                    {year === String(new Date().getFullYear()) ? 'Current' : year} {/* Display 'Current' for the current year */} 
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
       </CardHeader>
       <CardContent className="px-6 pb-6"> {/* Added px-6 and pb-6 for padding */}
         <div className="space-y-4">
           <div className="flex justify-between">
             <div>
               <p className="text-lg font-bold text-yellow-600">{streakData?.currentStreak || 0}</p>
               <p className="text-sm text-muted-foreground">Current Streak</p>
             </div>
             <div>
               <p className="text-lg font-bold text-yellow-600">{streakData?.longestStreak || 0}</p>
               <p className="text-sm text-muted-foreground">Longest Streak</p>
             </div>
             <div>
               <p className="text-lg font-bold text-yellow-600">{streakData?.totalActiveDays || 0}</p>
               <p className="text-sm text-muted-foreground">Total Active Days</p>
             </div>
           </div>
           {/* Container for the Activity Heatmap - Ensure it constrains width and handles overflow */}
           {/* Added w-full and overflow-hidden to make this div take full width and clip content */}
           <div className="relative w-full overflow-hidden"> 
             {/* Render the separate ActivityHeatmap component */}
             <ActivityHeatmap displayDays={displayDays} weeks={weeks} streakData={streakData} />
           </div>
         </div>
         {/* Legend */}
         <div className="flex justify-end items-center text-xs text-muted-foreground mt-2">
            Less <span className="w-3 h-3 rounded-sm bg-gray-800 mx-1"></span>
            <span className="w-3 h-3 rounded-sm bg-green-700 mx-0.5"></span>
            <span className="w-3 h-3 rounded-sm bg-green-600 mx-0.5"></span>
            <span className="w-3 h-3 rounded-sm bg-green-500 mx-0.5"></span>
            <span className="w-3 h-3 rounded-sm bg-green-400 ml-0.5 mr-1"></span> More
         </div>
       </CardContent>
     </Card>
   );
};

export default ProfileActivityStreak; 