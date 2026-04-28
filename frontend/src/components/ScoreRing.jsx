import React from 'react';

export default function ScoreRing({ score }) {
  const normalizedScore = isNaN(score) ? 0 : Math.min(100, Math.max(0, score));
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let color = 'text-green-500';
  if (normalizedScore < 50) color = 'text-red-500';
  else if (normalizedScore < 80) color = 'text-yellow-500';

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg className="transform -rotate-90 w-24 h-24">
        {/* Background ring */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-dark-700"
        />
        {/* Progress ring */}
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${color} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{normalizedScore}</span>
      </div>
    </div>
  );
}
