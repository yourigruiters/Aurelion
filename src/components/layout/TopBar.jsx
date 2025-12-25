import React from "react";
import { useSelector } from "react-redux";
import {
  Settings,
  Bell,
  BookOpen,
  Crown,
  Gem,
  Hammer,
  Wheat,
  Apple,
  Mountain,
} from "lucide-react";

const ResourceItem = ({ icon: Icon, value, color }) => (
  <div className="flex items-center space-x-1.5 bg-zinc-800/50 px-2 py-1 rounded">
    <Icon size={16} className={color} />
    <span className="text-sm font-medium">{value}</span>
  </div>
);

const TopBar = () => {
  const { population, happiness, resources } = useSelector(
    (state) => state.resources
  );

  return (
    <header className="h-full w-full bg-zinc-900 border-b border-zinc-700 flex items-center justify-between px-4">
      {/* Left: Brand / Region */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Crown size={24} className="text-yellow-500" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">
            Aurelion
          </h1>
        </div>
        <div className="h-6 w-px bg-zinc-700 mx-2" />
        <div className="flex flex-col">
          <span className="text-xs text-zinc-400 uppercase tracking-wider">
            Region
          </span>
          <span className="text-sm font-semibold">Highlands of Aethelgard</span>
        </div>
      </div>

      {/* Center: Resources */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 mr-4">
          <span className="text-xs text-zinc-400">Pop:</span>
          <span className="text-sm font-semibold text-white">{population}</span>
          <span className="text-xs text-zinc-400 ml-2">Happy:</span>
          <span className="text-sm font-semibold text-green-400">
            {happiness}%
          </span>
        </div>

        <div className="h-8 w-px bg-zinc-700 mr-2" />

        <div className="flex items-center space-x-3">
          <ResourceItem
            icon={Apple}
            value={resources.food}
            color="text-red-400"
          />
          <ResourceItem
            icon={Wheat}
            value={resources.wood}
            color="text-amber-600"
          />
          <ResourceItem
            icon={Mountain}
            value={resources.stone}
            color="text-stone-400"
          />
          <ResourceItem
            icon={Hammer}
            value={resources.iron}
            color="text-slate-300"
          />
          <ResourceItem
            icon={Gem}
            value={resources.gold}
            color="text-yellow-400"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3">
        <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
          <BookOpen size={20} />
        </button>
        <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
