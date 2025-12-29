import React from "react";
import { useSelector } from "react-redux";
import {
  BookOpen,
  Crown,
  Gem,
  Hammer,
  Wheat,
  Apple,
  Mountain,
  Users,
} from "lucide-react";
import ResourceItem from "../ui/ResourceItem";
import { RootState } from "../../store/store";

// Helper to format date from daysPassed (Start: 1650-01-01)
// Helper to get ordinal suffix
const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

// Helper to format date from daysPassed (Start: 1650-01-01)
const formatDate = (daysPassed: number) => {
  const startDate = new Date("1650-01-01");
  startDate.setDate(startDate.getDate() + daysPassed);

  const day = startDate.getDate();
  const month = startDate.toLocaleDateString("en-GB", { month: "long" });
  const year = startDate.getFullYear();

  return `${day}${getOrdinalSuffix(day)} of ${month}, ${year}`;
};

interface TopBarProps {
  isRightSidebarOpen: boolean;
  onToggleRightSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
  isRightSidebarOpen,
  onToggleRightSidebar,
}) => {
  const {
    population,
    resources,
    daysPassed = 0,
    rates,
  } = useSelector((state: RootState) => state.resources);
  const { housing } = useSelector((state: RootState) => state.buildings);
  const { gameStarted, cityName, region } = useSelector(
    (state: RootState) => state.game
  );

  const totalHousingCapacity = Object.values(housing).reduce(
    (total, house) => total + house.populationCap,
    0
  );

  return (
    <header className="h-full w-full bg-bg-main border-b border-border-main flex items-center justify-between px-4">
      {/* Left Area: Logo & Region */}
      <div className="flex items-center space-x-4 min-w-[300px]">
        <div className="flex items-center space-x-2">
          <Crown size={24} className="text-accent" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-brand text-transparent bg-clip-text">
            Aurelion
          </h1>
        </div>
        <div className="h-6 w-px bg-border-main mx-2" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {gameStarted ? cityName : "Uncharted Territory"}
          </span>
          <span className="text-xs text-text-muted uppercase tracking-wider">
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

        <div className="h-6 w-px bg-border-main" />

        {/* Population & Food Group */}
        <div className="flex items-center space-x-3">
          <ResourceItem
            icon={Users}
            value={population}
            max={totalHousingCapacity} // Add max prop if supported or handle via value string
            color="text-info"
            tooltipLabel="Population"
            customValueDisplay={`${population}/${totalHousingCapacity}`}
          />
          <ResourceItem
            icon={Apple}
            value={resources.food}
            rate={rates.food}
            color="text-danger-light"
            tooltipLabel="Food"
          />
        </div>

        <div className="h-6 w-px bg-border-main" />

        {/* Other Resources */}
        <div className="flex items-center space-x-2">
          <ResourceItem
            icon={Wheat}
            value={resources.wood}
            rate={rates.wood}
            color="text-brand"
            tooltipLabel="Wood"
          />
          <ResourceItem
            icon={Mountain}
            value={resources.stone}
            rate={rates.stone}
            color="text-text-muted"
            tooltipLabel="Stone"
          />
          <ResourceItem
            icon={Hammer}
            value={resources.iron}
            rate={rates.iron}
            color="text-text-secondary"
            tooltipLabel="Iron"
          />
          <ResourceItem
            icon={Gem}
            value={resources.gold}
            rate={rates.gold}
            color="text-accent"
            tooltipLabel="Gold"
          />
        </div>
      </div>

      {/* Right Area: Actions */}
      <div className="flex items-center space-x-3 min-w-[300px] justify-end">
        <button
          onClick={onToggleRightSidebar}
          className={`p-2 rounded-full transition-colors relative cursor-pointer ${
            isRightSidebarOpen
              ? "bg-bg-panel text-white"
              : "text-text-muted hover:bg-bg-panel hover:text-white"
          }`}
          title="Toggle Logbook"
        >
          <BookOpen size={20} />
          {/* Notification Badge */}
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border border-bg-main"></span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
