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
  Users,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// Helper to format date from daysPassed (Start: 1650-01-01)
const formatDate = (daysPassed) => {
  const startDate = new Date("1650-01-01");
  startDate.setDate(startDate.getDate() + daysPassed);
  return startDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const ResourceItem = ({ icon: Icon, value, rate = 0, color, tooltipLabel }) => {
  // Determine arrow
  let ArrowIcon = null;
  let arrowColor = "";
  if (rate > 0) {
    ArrowIcon = ChevronUp;
    arrowColor = "text-green-500";
  } else if (rate < 0) {
    ArrowIcon = ChevronDown;
    arrowColor = "text-red-500";
  }

  return (
    <div className="group relative flex items-center space-x-1.5 bg-zinc-800/50 px-2 py-1 rounded cursor-default border border-transparent hover:border-zinc-600 transition-colors">
      <Icon size={16} className={color} />
      <span className="text-sm font-medium">{Math.floor(value)}</span>
      {ArrowIcon && <ArrowIcon size={12} className={arrowColor} />}

      {/* Tooltip */}
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-zinc-900 border border-zinc-700 shadow-xl rounded p-2 text-xs z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="font-bold mb-1 text-zinc-300">{tooltipLabel}</div>
        <div className="flex justify-between text-green-400">
          <span>Income:</span>
          <span>+{rate > 0 ? rate : 0} / day</span>
        </div>
        {/* TODO: Add 'Use' when consumption logic exists */}
        <div className="flex justify-between text-red-400">
          <span>Use:</span>
          <span>{rate < 0 ? rate : 0} / day</span>
        </div>
      </div>
    </div>
  );
};

const TopBar = () => {
  const {
    population,
    resources,
    daysPassed = 0,
    rates,
  } = useSelector((state) => state.resources);
  const { gameStarted, cityName, region } = useSelector((state) => state.game);

  return (
    <header className="h-full w-full bg-zinc-900 border-b border-zinc-700 flex items-center justify-between px-4">
      {/* Left Area: Logo & Region */}
      <div className="flex items-center space-x-4 min-w-[300px]">
        <div className="flex items-center space-x-2">
          <Crown size={24} className="text-yellow-500" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">
            Aurelion
          </h1>
        </div>
        <div className="h-6 w-px bg-zinc-700 mx-2" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {gameStarted ? cityName : "Uncharted Territory"}
          </span>
          <span className="text-xs text-zinc-400 uppercase tracking-wider">
            {gameStarted ? `Region: ${region}` : "Region: Unknown"}
          </span>
        </div>
      </div>

      {/* Center Area: Date & Resources */}
      <div className="flex-1 flex items-center justify-center space-x-6">
        {/* Date */}
        <div className="flex items-center space-x-2">
          <div className="flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-sm font-bold text-white font-mono leading-none">
              {formatDate(daysPassed)}
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-zinc-700" />

        {/* Population & Food Group */}
        <div className="flex items-center space-x-3">
          <ResourceItem
            icon={Users}
            value={population}
            rate={rates.population}
            color="text-blue-300"
            tooltipLabel="Population"
          />
          <ResourceItem
            icon={Apple}
            value={resources.food}
            rate={rates.food}
            color="text-red-400"
            tooltipLabel="Food"
          />
        </div>

        <div className="h-6 w-px bg-zinc-700" />

        {/* Other Resources */}
        <div className="flex items-center space-x-2">
          <ResourceItem
            icon={Wheat}
            value={resources.wood}
            rate={rates.wood}
            color="text-amber-600"
            tooltipLabel="Wood"
          />
          <ResourceItem
            icon={Mountain}
            value={resources.stone}
            rate={rates.stone}
            color="text-stone-400"
            tooltipLabel="Stone"
          />
          <ResourceItem
            icon={Hammer}
            value={resources.iron}
            rate={rates.iron}
            color="text-slate-300"
            tooltipLabel="Iron"
          />
          <ResourceItem
            icon={Gem}
            value={resources.gold}
            rate={rates.gold}
            color="text-yellow-400"
            tooltipLabel="Gold"
          />
        </div>
      </div>

      {/* Right Area: Actions */}
      <div className="flex items-center space-x-3 min-w-[300px] justify-end">
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
