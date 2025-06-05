import React from 'react';
import { format, getDay } from 'date-fns';

const ActivityHeatmap = ({ displayDays, weeks, streakData }) => {

  const heatmapColumns = weeks.map((week, weekIndex) => (
    <div key={weekIndex} className="flex flex-col gap-0.5">
      {week.map((day, dayIndex) => {
        if (!day) return <div key={dayIndex} className="w-3 h-3" />;

        const dateString = day.toDateString();
        const submissionCount = streakData.activeDays.find(
          d => new Date(d.date).toDateString() === dateString
        )?.count || 0;

        let bgColor = 'bg-muted';
        if (submissionCount > 0) {
          if (submissionCount >= 5) bgColor = 'bg-green-600';
          else if (submissionCount >= 3) bgColor = 'bg-green-500';
          else if (submissionCount >= 1) bgColor = 'bg-green-400';
        }

        return (
          <div
            key={dayIndex}
            className={`w-3 h-3 rounded-sm ${bgColor} hover:scale-125 transition-transform`}
            title={`${format(day, 'MMM d, yyyy')}: ${submissionCount} submissions`}
          />
        );
      })}
    </div>
  ));

   // Day labels for rows (Mon, Wed, Fri)
   const verticalDayLabels = ['Mon', 'Wed', 'Fri'];
   // Indices for Monday, Wednesday, Friday (0 for Mon, 1 for Tue, ..., 6 for Sun)
   // We only render labels for Mon (0), Wed (2), Fri (4) in a 0-indexed week starting Monday
   const labelRowIndices = [0, 2, 4]; // Corresponds to the row index in the 7-row grid

   const dayLabelElements = Array.from({ length: 7 }, (_, index) => {
       const labelText = labelRowIndices.includes(index) ? verticalDayLabels[labelRowIndices.indexOf(index)] : '';

       return (
           <div key={index} className="text-xs text-muted-foreground h-3 flex items-center justify-end" style={{ height: '14px' }}> {/* Height should match cell height + gap / 7 rows */}
               {labelText}
           </div>
       );
   });


  return (
      <div className="relative flex overflow-hidden">
          {/* Vertical Day Labels - Fixed width */}
          {/* The vertical labels container has pr-1 (0.25rem = 4px) and a defined width w-8 (2rem = 32px) */}
          {/* Total width of vertical label area = 32px + 4px = 36px */}
          <div className="flex flex-col gap-0.5 pr-1 text-right w-8 flex-shrink-0"> {/* Added flex-shrink-0 */}
             {dayLabelElements}
          </div>
          {/* Heatmap Grid (Horizontal layout) - Wrapped in a scrolling container */}
          {/* Use flex-grow to take available space and min-w-0 to allow shrinking */}
          {/* Adjusted padding for alignment. Removed explicit width style to rely on flex-grow */}
          {/* Ensure it takes full width of the remaining space and scrolls internally */}
          <div className="flex flex-row items-start gap-0.5 overflow-x-auto hide-scrollbar flex-grow min-w-0 pb-8 pl-6 pr-6"> {/* Removed width style */}
              {heatmapColumns}
          </div>
      </div>
  );
};

export default ActivityHeatmap; 