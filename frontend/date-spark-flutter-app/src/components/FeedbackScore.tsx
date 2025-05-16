
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

type FeedbackScoreProps = {
  label: string;
  score: number;
  color: string;
  delay?: number;
};

const FeedbackScore: React.FC<FeedbackScoreProps> = ({ 
  label, 
  score, 
  color,
  delay = 0
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const interval = setInterval(() => {
        start += 2;
        setDisplayScore(start > score ? score : start);
        if (start >= score) {
          clearInterval(interval);
        }
      }, 20);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [score, delay]);

  return (
    <div className="mb-6 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex justify-between mb-2">
        <span className="font-medium">{label}</span>
        <span className="font-semibold">{displayScore}%</span>
      </div>
      <Progress 
        value={displayScore} 
        className="h-2"
        // Use inline styles to achieve the color effect without indicatorStyle
        style={{
          backgroundColor: `${color}20`,
          '--progress-foreground': color,
        } as React.CSSProperties}
      />
    </div>
  );
};

export default FeedbackScore;
