import React from "react";
import { useSelector } from "react-redux";

const GameView = () => {
  const activeTab = useSelector((state) => state.ui.activeTab);

  return (
    <div className="h-full w-full relative bg-zinc-900 flex items-center justify-center overflow-hidden">
      {/* Abstract Background Grid */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Placeholder Content Area */}
      <div className="z-10 text-center space-y-4 max-w-lg p-8 bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-zinc-700 shadow-2xl">
        <h2 className="text-2xl font-bold text-white capitalize">
          {activeTab.replace("-", " ")} View
        </h2>
        <p className="text-zinc-400">
          This is the placeholder for the{" "}
          <span className="text-yellow-500 font-mono">{activeTab}</span>{" "}
          interface.
        </p>
        <div className="flex justify-center space-x-2 pt-4">
          <div
            className="w-16 h-16 bg-zinc-700 rounded hover:bg-zinc-600 transition-colors cursor-pointer border border-zinc-600 hover:border-zinc-500"
            title="Building Slot"
          />
          <div
            className="w-16 h-16 bg-zinc-700 rounded hover:bg-zinc-600 transition-colors cursor-pointer border border-zinc-600 hover:border-zinc-500"
            title="Building Slot"
          />
          <div
            className="w-16 h-16 bg-zinc-700 rounded hover:bg-zinc-600 transition-colors cursor-pointer border border-zinc-600 hover:border-zinc-500"
            title="Building Slot"
          />
        </div>
      </div>

      {/* Floating elements could go here (tooltips, etc) */}
    </div>
  );
};

export default GameView;
