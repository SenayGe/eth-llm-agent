import React from "react";

interface StatisticProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export const Statistic: React.FC<StatisticProps> = ({ title, value, icon }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-sm font-semibold text-gray-800 truncate max-w-full">
        {value}
      </p>
    </div>
  );
};
