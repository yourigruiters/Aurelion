import React from "react";
import { Pickaxe, ScrollText, ArrowUpCircle } from "lucide-react";

const ActionButton = ({ icon: Icon, label, colorClass }) => (
  <button className="flex items-center space-x-2 w-full p-2 rounded bg-zinc-700/40 hover:bg-zinc-700 transition-colors border border-transparent hover:border-zinc-600">
    <div className={`p-1.5 rounded bg-zinc-800 ${colorClass}`}>
      <Icon size={16} />
    </div>
    <span className="text-sm text-zinc-300">{label}</span>
  </button>
);

const Notification = ({ title, time, type }) => (
  <div className="p-3 bg-zinc-700/30 rounded border-l-2 border-zinc-600 hover:bg-zinc-700/50 transition-colors cursor-pointer">
    <h4 className="text-sm font-medium text-zinc-200">{title}</h4>
    <span className="text-xs text-zinc-500">{time}</span>
  </div>
);

const RightSidebar = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-zinc-700">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Quick Actions
        </h2>
      </div>

      <div className="p-4 space-y-2">
        <ActionButton
          icon={Pickaxe}
          label="Collect All"
          colorClass="text-green-400"
        />
        <ActionButton
          icon={ArrowUpCircle}
          label="Upgrade Town Center"
          colorClass="text-blue-400"
        />
      </div>

      <div className="p-4 border-t border-zinc-700 border-b">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Construction Queue
        </h2>
        <div className="text-sm text-zinc-400 italic text-center py-2">
          No active construction
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 bg-zinc-800 p-4 pb-2 z-10">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Log & Alerts
          </h2>
        </div>
        <div className="px-4 pb-4 space-y-2">
          <Notification title="Villager arrived" time="2m ago" />
          <Notification title="Storage full: Wood" time="5m ago" />
          <Notification title="Game saved" time="10m ago" />
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
