
import React from 'react';

interface RoadIconProps {
  size?: number;
  className?: string;
}

export const RoadIcon: React.FC<RoadIconProps> = ({ size = 24, className = "" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 8a5 5 0 0 1 10 0a5 5 0 0 1 0 10H5a5 5 0 0 1 0 -10" />
      <path d="M8 3L9 7" />
      <path d="M12 5L12 8" />
      <path d="M16 3L15 7" />
      <path d="M8 21L9 17" />
      <path d="M12 19L12 16" />
      <path d="M16 21L15 17" />
    </svg>
  );
};

export default RoadIcon;
