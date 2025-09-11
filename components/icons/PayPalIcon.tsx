import React from 'react';

interface IconProps {
  className?: string;
}

const PayPalIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M7.068 2.553C7.472 2.022 8.41.967 10.165.967h3.138c3.242 0 5.433 1.832 4.634 5.332-.731 3.204-2.858 5.03-5.518 5.03h-2.115c-.958 0-1.328.369-1.155 1.346l.667 3.779c.105.592.518.96 1.155.96h.312c2.459 0 4.192-1.42 4.796-4.045.152-.656.804-.656.957 0 .864 3.71-1.936 5.454-5.753 5.454h-2.116c-3.14 0-4.088-1.926-3.41-5.034l.666-3.78c.174-1.077-.25-1.831-1.327-1.831H4.41c-1.053 0-1.39.885-1.542 1.542-.153.655-.804.655-.957 0C1.18 5.143 3.65 2.553 7.068 2.553z" />
  </svg>
);

export default PayPalIcon;
