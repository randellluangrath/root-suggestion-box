import React from "react";

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-gray-500 opacity-75 rounded-full animate-bounce"></div>
        <div className="absolute inset-0 bg-gray-500 opacity-75 rounded-full animate-bounce delay-1000"></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
