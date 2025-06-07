import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Flame, Info } from 'lucide-react';
import { submissionAPI } from '@/api/api';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO, startOfYear, endOfYear, eachDayOfInterval, getDay, addDays, startOfWeek, isSameDay, getWeek, getWeeksInMonth, isBefore, isAfter, subYears, endOfWeek, startOfMonth, addMonths, getMonth, getYear, endOfMonth } from 'date-fns';
import ActivityHeatmap from './ActivityHeatmap';
import { motion } from 'framer-motion';

const ProfileActivityStreak = ({ userId }) => {
   const [streakData, setStreakData] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [selectedRange, setSelectedRange] = useState(String(new Date().getFullYear()));
   const [availableYears, setAvailableYears] = useState([]);
   const [totalSubmissions, setTotalSubmissions] = useState(0);

   useEffect(() => {
     const currentYear = new Date().getFullYear();
     const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
     setAvailableYears(years.map(String));
     setSelectedRange(String(currentYear));
   }, []);

   useEffect(() => {
     const fetchStreakData = async () => {
       if (!userId) return;
       setIsLoading(true);
       try {
         const year = selectedRange === String(new Date().getFullYear()) ? null : selectedRange;
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

   const renderHeatmapData = () => {
       if (!streakData) return { displayDays: [], weeks: [] };

       let displayStartDate, displayEndDate;
       const today = new Date();

       if (selectedRange === String(today.getFullYear())) {
         displayEndDate = endOfWeek(today, { weekStartsOn: 1 });
         displayStartDate = startOfWeek(subYears(displayEndDate, 1), { weekStartsOn: 1 });
       } else {
         const year = parseInt(selectedRange, 10);
         displayStartDate = startOfWeek(startOfYear(new Date(year, 0, 1)), { weekStartsOn: 1 });
         displayEndDate = endOfWeek(endOfYear(new Date(year, 0, 1)), { weekStartsOn: 1 });
       }

       const displayDays = eachDayOfInterval({ start: displayStartDate, end: displayEndDate });
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
       <Card className="bg-card/50 backdrop-blur-sm">
         <CardHeader>
           <CardTitle className="text-sm font-medium">Activity Streak</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="animate-pulse space-y-4">
             <div className="h-8 bg-muted/30 rounded-lg w-1/3"></div>
             <div className="h-40 bg-muted/30 rounded-lg"></div>
           </div>
         </CardContent>
       </Card>
     );
   }

   if (!streakData) {
      return (
        <Card className="bg-card/50 backdrop-blur-sm">
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
     <Card className="bg-card/50 backdrop-blur-sm border-border/50">
       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-6">
         <motion.div 
           className="flex items-center gap-2"
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
         >
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            <CardTitle className="text-sm font-medium">Activity Streak</CardTitle>
         </motion.div>

         <div className="flex items-center gap-4">
           <motion.div 
             className="flex items-center text-sm text-muted-foreground gap-4"
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.1 }}
           >
             <span>Total active days: <span className="font-semibold text-foreground">{streakData.totalActiveDays}</span></span>
             <span>Max streak: <span className="font-semibold text-foreground">{streakData.longestStreak}</span></span>
           </motion.div>
           <Select onValueChange={(value) => setSelectedRange(value)} value={selectedRange}>
             <SelectTrigger className="w-[100px] h-8 bg-background/50">
               <SelectValue placeholder="Select Range" />
             </SelectTrigger>
             <SelectContent>
               {availableYears.map(year => (
                 <SelectItem key={year} value={year}>
                   {year === String(new Date().getFullYear()) ? 'Current' : year}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>
       </CardHeader>
       <CardContent className="px-6 pb-6">
         <div className="space-y-6">
           <motion.div 
             className="grid grid-cols-3 gap-4"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
           >
             <div className="bg-background/50 rounded-lg p-4 text-center">
               <p className="text-2xl font-bold text-orange-500">{streakData?.currentStreak || 0}</p>
               <p className="text-sm text-muted-foreground">Current Streak</p>
             </div>
             <div className="bg-background/50 rounded-lg p-4 text-center">
               <p className="text-2xl font-bold text-orange-500">{streakData?.longestStreak || 0}</p>
               <p className="text-sm text-muted-foreground">Longest Streak</p>
             </div>
             <div className="bg-background/50 rounded-lg p-4 text-center">
               <p className="text-2xl font-bold text-orange-500">{streakData?.totalActiveDays || 0}</p>
               <p className="text-sm text-muted-foreground">Total Active Days</p>
             </div>
           </motion.div>

           <motion.div 
             className="relative w-full overflow-hidden"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.3 }}
           >
             <ActivityHeatmap displayDays={displayDays} weeks={weeks} streakData={streakData} />
           </motion.div>
         </div>
       </CardContent>
     </Card>
   );
};

export default ProfileActivityStreak; 