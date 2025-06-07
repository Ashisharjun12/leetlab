import React from 'react';
import { format, getDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ActivityHeatmap = ({ displayDays, weeks, streakData }) => {
  const getColorIntensity = (count) => {
    if (count === 0) return 'bg-muted/30';
    if (count >= 5) return 'bg-green-600';
    if (count >= 3) return 'bg-green-500';
    if (count >= 1) return 'bg-green-400';
    return 'bg-muted/30';
  };

  const heatmapColumns = weeks.map((week, weekIndex) => (
    <motion.div 
      key={weekIndex} 
      className="flex flex-col gap-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: weekIndex * 0.05 }}
    >
      {week.map((day, dayIndex) => {
        if (!day) return <div key={dayIndex} className="w-4 h-4" />;

        const dateString = day.toDateString();
        const submissionCount = streakData.activeDays.find(
          d => new Date(d.date).toDateString() === dateString
        )?.count || 0;

        return (
          <TooltipProvider key={dayIndex}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  className={`w-4 h-4 rounded-md ${getColorIntensity(submissionCount)} 
                    hover:scale-110 transition-all duration-200 cursor-pointer
                    hover:shadow-md hover:shadow-primary/20`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className="bg-background border border-border shadow-lg"
              >
                <p className="font-medium">{format(day, 'MMM d, yyyy')}</p>
                <p className="text-sm text-muted-foreground">
                  {submissionCount} {submissionCount === 1 ? 'submission' : 'submissions'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </motion.div>
  ));

  const dayLabels = ['Mon', 'Wed', 'Fri'];
  const labelIndices = [0, 2, 4];

  const dayLabelElements = Array.from({ length: 7 }, (_, index) => {
    const labelText = labelIndices.includes(index) 
      ? dayLabels[labelIndices.indexOf(index)] 
      : '';

    return (
      <motion.div 
        key={index} 
        className="text-xs text-muted-foreground h-4 flex items-center justify-end pr-2"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        {labelText}
      </motion.div>
    );
  });

  return (
    <div className="relative flex overflow-hidden bg-card/50 rounded-lg p-4">
      {/* Vertical Day Labels */}
      <div className="flex flex-col gap-1 pr-2 w-12 flex-shrink-0">
        {dayLabelElements}
      </div>

      {/* Heatmap Grid */}
      <div className="flex flex-row items-start gap-1 overflow-x-auto flex-grow min-w-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {heatmapColumns}
      </div>

      {/* Legend */}
      <div className="absolute bottom-0 right-0 flex items-center gap-2 text-xs text-muted-foreground p-2">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-md bg-muted/30" />
          <div className="w-3 h-3 rounded-md bg-green-400" />
          <div className="w-3 h-3 rounded-md bg-green-500" />
          <div className="w-3 h-3 rounded-md bg-green-600" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap; 