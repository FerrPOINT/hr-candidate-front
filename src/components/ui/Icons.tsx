import React from "react";

interface IconProps {
  color?: string;
  className?: string;
}

export const SuitcaseLineIconV7: React.FC<IconProps> = ({ color = "currentColor", className = "" }) => (
  <svg className={`w-5 h-5 ${className}`} viewBox="0 0 24 24" fill="none">
    <path d="M20 7H4V5C4 3.9 4.9 3 6 3H18C19.1 3 20 3.9 20 5V7Z" stroke={color} strokeWidth="2"/>
    <path d="M20 7V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V7" stroke={color} strokeWidth="2"/>
  </svg>
);

export const PieChartLineIconV7: React.FC<IconProps> = ({ color = "currentColor", className = "" }) => (
  <svg className={`w-5 h-5 ${className}`} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
    <path d="M12 2V12L20 12" stroke={color} strokeWidth="2"/>
  </svg>
);

export const TeamLineIconV7: React.FC<IconProps> = ({ color = "currentColor", className = "" }) => (
  <svg className={`w-5 h-5 ${className}`} viewBox="0 0 24 24" fill="none">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke={color} strokeWidth="2"/>
    <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke={color} strokeWidth="2"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke={color} strokeWidth="2"/>
  </svg>
);
