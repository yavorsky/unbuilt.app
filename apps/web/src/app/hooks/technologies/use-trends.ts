import { DisplayType } from '@/app/components/technologies/technology-trends';
import { TechnologyTrend } from '@/server/api/get-technology-trends';
import { useMemo } from 'react';

export const useTrends = (
  data: TechnologyTrend[],
  displayType: DisplayType = 'count'
) => {
  return useMemo(() => {
    if (data.length < 2) return [];

    // Get all unique technologies
    const technologies = data.reduce<Set<string>>((techSet, point) => {
      Object.keys(point.technologies).forEach((tech) => techSet.add(tech));
      return techSet;
    }, new Set());

    // Calculate trend for each technology
    const changes = Array.from(technologies).map((tech) => {
      // Collect all values for this technology across dates
      const points = data.map((day, index) => ({
        x: index, // Use index as x coordinate for simplicity
        y: day.technologies[tech]?.[displayType] ?? 0,
      }));

      // Calculate linear regression
      const n = points.length;
      const sumX = points.reduce((sum, p) => sum + p.x, 0);
      const sumY = points.reduce((sum, p) => sum + p.y, 0);
      const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
      const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);

      // Calculate slope
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

      // Calculate total change
      const totalChange = points[points.length - 1].y - points[0].y;

      // Calculate consistency score (how consistently it's moving up or down)
      let consecutiveMovements = 0;
      let firstMeaningfulPoint;
      let lastMeaningfulPoint;
      for (let i = 1; i < points.length; i++) {
        const currentMovement = points[i].y - points[i - 1].y;
        const slopeDirection = slope > 0 ? 1 : -1;
        if (Math.sign(currentMovement) === slopeDirection) {
          consecutiveMovements++;
          if (!firstMeaningfulPoint) {
            firstMeaningfulPoint = points[i];
          }
          lastMeaningfulPoint = points[i];
        }
      }
      const consistency = consecutiveMovements / (points.length - 1);

      // Combine slope and consistency for final trend score
      const trendScore = slope * consistency * (points.length / 2);

      const change =
        (lastMeaningfulPoint?.y ?? 0) - (firstMeaningfulPoint?.y ?? 0);
      const trendChange =
        (lastMeaningfulPoint?.x ?? 0) - (firstMeaningfulPoint?.x ?? 0);

      return {
        name: tech,
        change: totalChange,
        partChange: change,
        partDays: trendChange,
        trendScore,
        direction: trendScore > 0 ? 'up' : 'down',
        consistency: Number((consistency * 100).toFixed(1)),
        dataPoints: points.length,
      } as const;
    });

    // Sort by trend score to find most consistent trends
    return changes
      .filter((trend) => !isNaN(trend.trendScore)) // Remove invalid trends
      .sort((a, b) => Math.abs(b.trendScore) - Math.abs(a.trendScore));
  }, [data, displayType]);
};
