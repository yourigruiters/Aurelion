import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  Users,
  Hammer,
  ShoppingCart,
  Map,
  Home,
  ShieldAlert,
  Activity,
  LucideIcon,
  Swords,
  Shield,
} from "lucide-react";

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
  const { militaryPower, defense } = useSelector(
    (state: RootState) => state.military
  );

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
          <div className="flex items-center gap-2 px-2 py-1 bg-bg-main rounded border border-border-main">
            <Swords size={14} className="text-danger" />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-muted uppercase leading-none">
                Attack
              </span>
              <span className="text-xs font-bold leading-none">
                {militaryPower}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 bg-bg-main rounded border border-border-main">
            <Shield size={14} className="text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-muted uppercase leading-none">
                Defense
              </span>
              <span className="text-xs font-bold leading-none">{defense}</span>
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
