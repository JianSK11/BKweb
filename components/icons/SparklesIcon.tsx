
import React from 'react';

interface IconProps {
  className?: string;
}

const SparklesIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3L9.5 8.5 4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z"></path>
    <path d="M22 17l-1.5 1-1.5-1-1 1.5 1 1.5-1 1.5 1 1.5 1.5-1 1.5 1 1-1.5-1-1.5 1-1.5z"></path>
    <path d="M2 7l1.5-1 1.5 1 1-1.5-1-1.5 1-1.5-1-1.5-1.5 1-1.5-1-1 1.5 1 1.5-1 1.5z"></path>
  </svg>
);

export default SparklesIcon;
