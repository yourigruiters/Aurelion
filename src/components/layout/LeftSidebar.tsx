import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  Users,
  Hammer,
  ShoppingCart,
  Home,
  ShieldAlert,
  Activity,
  LucideIcon,
  Swords,
  Shield,
} from "lucide-react";
import { MILITARY_TECHS } from "../../store/militarySlice"; // Import defined

interface SidebarItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
        isActive
          ? "bg-bg-main text-accent border-r-2 border-accent"
          : "text-text-secondary hover:bg-bg-main/50 hover:text-text-main"
      }`
    }
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
);

const LeftSidebar: React.FC = () => {
  /* Restore game state selectors */
  const { level, experience, maxExperience } = useSelector(
    (state: RootState) => state.game
  );
  // Get military bonuses
  const { totalAttackBonus, totalDefenseBonus, unlockedTechs } = useSelector(
    (state: RootState) => state.military
  );
  // Get assignments
  const { assignments } = useSelector((state: RootState) => state.resources);

  // Calculate actual stats
  // Attack: Based on WARRIORS (not population) + bonus per warrior.
  // Formula: Warriors * (1 + Bonus)
  const warriorCount = Number(assignments["Warrior"] || 0);
  const attackValue = Math.floor(warriorCount * (1 + (totalAttackBonus || 0)));

  // Defense: "high per item... +30 +50" -> Flat sum of bonuses.
  const defenseValue = totalDefenseBonus || 0;

  // Derive active bonuses for display
  const attackTechs = unlockedTechs
    .map((id) => MILITARY_TECHS[id])
    .filter((tech) => tech && tech.effects.attackBonus);

  const defenseTechs = unlockedTechs
    .map((id) => MILITARY_TECHS[id])
    .filter((tech) => tech && tech.effects.defenseBonus);

  const menuItems = [
    { to: "/overview", icon: Home, label: "Overview" },
    { to: "/people", icon: Users, label: "Population" },
    { to: "/activities", icon: Activity, label: "Activities" },
    { to: "/buildings", icon: Hammer, label: "Buildings" },
    { to: "/market", icon: ShoppingCart, label: "Market Hall" },
    { to: "/military", icon: ShieldAlert, label: "Military" },
  ];

  const xpPercentage = Math.min(
    100,
    Math.floor((experience / maxExperience) * 100)
  );

  return (
    <div className="flex flex-col h-full">
      {/* Level & XP Section */}
      <div className="p-4 border-b border-border-main bg-bg-panel/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            City Level
          </span>
          <span className="text-sm font-bold text-accent">{level}</span>
        </div>
        <div className="w-full h-2 bg-bg-main rounded-full overflow-hidden border border-border-main">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 mb-4">
          <span className="text-[10px] text-text-muted">XP</span>
          <span className="text-[10px] text-text-muted">
            {experience} / {maxExperience}
          </span>
        </div>

        {/* Military Stats */}
        <div className="grid grid-cols-2 gap-2">
          {/* Attack Stat */}
          <div className="group relative flex items-center gap-2 px-2 py-1 bg-bg-main rounded border border-border-main cursor-help">
            <Swords size={14} className="text-danger" />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-muted uppercase leading-none">
                Attack
              </span>
              <span className="text-xs font-bold leading-none">
                {attackValue}
              </span>
            </div>
            {/* Tooltip */}
            <div className="absolute top-full left-0 mt-2 w-56 bg-bg-main border border-border-main shadow-xl rounded p-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="font-bold text-xs text-text-main mb-1">
                Attack Power
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Warriors:</span>
                  <span className="font-mono">{warriorCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Base Power:</span>
                  <span className="font-mono">{warriorCount}</span>
                </div>

                {/* Active Bonuses List */}
                {attackTechs.length > 0 && (
                  <div className="mt-2 pt-1 border-t border-border-light/50">
                    <div className="text-[10px] text-text-muted mb-1">
                      Active Bonuses:
                    </div>
                    {attackTechs.map((tech) => (
                      <div
                        key={tech.id}
                        className="flex justify-between text-success text-[10px]"
                      >
                        <span>{tech.name}:</span>
                        <span>+{tech.effects.attackBonus}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-border-light mt-1 pt-1 flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-danger">{attackValue}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Defense Stat */}
          <div className="group relative flex items-center gap-2 px-2 py-1 bg-bg-main rounded border border-border-main cursor-help">
            <Shield size={14} className="text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-muted uppercase leading-none">
                Defense
              </span>
              <span className="text-xs font-bold leading-none">
                {defenseValue}
              </span>
            </div>
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 w-56 bg-bg-main border border-border-main shadow-xl rounded p-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="font-bold text-xs text-text-main mb-1">
                Defense
              </div>
              <div className="space-y-1 text-xs">
                <div className="text-text-secondary text-[10px] leading-tight mb-2">
                  Reduces casualties during night raids.
                </div>

                {/* Active Bonuses List */}
                {defenseTechs.length > 0 ? (
                  <div className="mt-1 pt-1 border-t border-border-light/50">
                    <div className="text-[10px] text-text-muted mb-1">
                      Active Bonuses:
                    </div>
                    {defenseTechs.map((tech) => (
                      <div
                        key={tech.id}
                        className="flex justify-between text-blue-400 text-[10px]"
                      >
                        <span>{tech.name}:</span>
                        <span>+{tech.effects.defenseBonus}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[10px] text-text-muted italic">
                    No active defense bonuses.
                  </div>
                )}

                <div className="border-t border-border-light mt-1 pt-1 flex justify-between font-bold">
                  <span>Total Bonus:</span>
                  <span className="text-blue-500">+{defenseValue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pb-2">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Management
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 flex flex-col">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>
    </div>
  );
};

export default LeftSidebar;
