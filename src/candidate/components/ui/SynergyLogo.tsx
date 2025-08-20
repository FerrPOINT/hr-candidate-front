import React from "react";

export const SynergyLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-center ${className}`}>
    <svg className="w-8 h-8 mr-2" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#3B82F6"/>
      <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" fill="white"/>
      <path d="M16 8V24" stroke="#3B82F6" strokeWidth="2"/>
    </svg>
    <span className="text-xl font-bold text-gray-900">Synergy</span>
  </div>
);

// Также экспортируем как default для совместимости
export default SynergyLogo; 