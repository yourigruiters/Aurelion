import React from "react";

const Overview: React.FC = () => {
  return (
    <div className="h-full w-full p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold text-text-main mb-6">Overview</h1>
      <div className="text-text-secondary">
        Welcome to your city. Here you can see a summary of your progress.
      </div>
    </div>
  );
};

export default Overview;
