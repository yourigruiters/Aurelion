import React from "react";
import { useSelector } from "react-redux";
import { BookOpen, Crown } from "lucide-react";
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
    modifiers,
  } = useSelector((state: RootState) => state.resources);
  const { housing } = useSelector((state: RootState) => state.buildings);
  const { gameStarted, cityName, region } = useSelector(
    (state: RootState) => state.game
  );

  // Calculate assigned population
  const assignments = useSelector(
    (state: RootState) => state.resources.assignments
  );
  const totalAssigned = Object.values(assignments).reduce(
    (sum, count) => sum + count,
    0
  );
  const idleVillagers = population - totalAssigned;

  const totalHousingCapacity = Object.values(housing).reduce(
    (total, house) => total + house.populationCap,
    0
  );

  // Define roles to display (excluding Warrior for the main list)
  const civilianRoles = [
    "Farmer",
    "Fisher",
    "Woodcutter",
    "Miner",
    "Deep Miner",
    "Merchant",
  ];

  const populationTooltip = (
    <div className="min-w-[140px]">
      <div className="font-bold pb-1 mb-1">Population</div>
      <div className="space-y-1">
        {civilianRoles.map((role) => (
          <div key={role} className="flex justify-between text-xs">
            <span className="text-text-secondary">{role}:</span>
            <span className="font-mono">{assignments[role] || 0}</span>
          </div>
        ))}
      </div>

      <div className="my-2 border-t border-border-light opacity-50" />

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-text-secondary">Warrior:</span>
          <span className="font-mono font-bold">
            {assignments["Warrior"] || 0}
          </span>
        </div>

        <div className="my-2 border-t border-border-light opacity-50" />

        <div
          className={`flex justify-between text-xs ${
            idleVillagers > 0 ? "text-danger" : "text-success"
          }`}
        >
          <span className="font-semibold">Idle:</span>
          <span className="font-mono font-bold">{idleVillagers}</span>
        </div>
      </div>
    </div>
  );

  return (
    <header className="h-full w-full bg-bg-main border-b border-border-main flex items-center justify-between px-4 gap-4">
      {/* Left Area: Logo & Region */}
      <div className="flex flex-shrink-0 items-center space-x-4 xl:min-w-[300px]">
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
            <span className="hidden lg:inline-flex">Region: </span>
            {gameStarted ? `${region}` : "Unknown"}
          </span>
        </div>
      </div>

      {/* Center Area: Date & Resources */}
      <div className="flex-1 flex items-center justify-center space-x-4 xl:space-x-6">
        {/* Date */}
        <div className="flex items-center space-x-1.5 xl:space-x-2">
          <div className="flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-sm font-bold text-white font-mono leading-none">
              {formatDate(daysPassed)}
            </span>
          </div>
        </div>

        <div className="h-6 w-px bg-border-main" />

        {/* Population & Gold Group */}
        <div className="flex items-center space-x-2 xl:space-x-3">
          <ResourceItem
            resource="population"
            value={population}
            max={totalHousingCapacity}
            tooltipLabel={populationTooltip}
            customValueDisplay={
              <span className="flex items-center">
                <span
                  className={
                    idleVillagers > 0
                      ? "font-bold text-danger"
                      : "text-text-muted"
                  }
                >
                  {population}
                </span>
                <span className="text-text-muted">/{totalHousingCapacity}</span>
              </span>
            }
          />
          <ResourceItem
            resource="gold"
            value={resources.gold}
            rate={rates.gold}
            modifier={modifiers.gold}
            tooltipLabel="Gold"
          />
        </div>

        <div className="h-6 w-px bg-border-main" />

        {/* Resources Group (Food, Wood, Stone, Iron) */}
        <div className="flex items-center space-x-1.5 xl:space-x-2">
          <ResourceItem
            resource="food"
            value={resources.food}
            rate={rates.food}
            modifier={modifiers.food}
            loss={population * 5} // 5 food per pop
            tooltipLabel="Food"
          />
          <ResourceItem
            resource="wood"
            value={resources.wood}
            rate={rates.wood}
            modifier={modifiers.wood}
            tooltipLabel="Wood"
          />
          <ResourceItem
            resource="stone"
            value={resources.stone}
            rate={rates.stone}
            modifier={modifiers.stone}
            tooltipLabel="Stone"
          />
          <ResourceItem
            resource="iron"
            value={resources.iron}
            rate={rates.iron}
            modifier={modifiers.iron}
            tooltipLabel="Iron"
          />
        </div>
      </div>

      {/* Right Area: Actions */}
      <div className="flex items-center space-x-3 justify-end xl:min-w-[300px]">
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
          {/* Notification Badge - Removed */}
        </button>
      </div>
    </header>
  );
};

export default TopBar;
