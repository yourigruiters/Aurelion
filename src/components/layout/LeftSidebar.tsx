import React from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  Hammer,
  ShoppingCart,
  Map,
  Home,
  ShieldAlert,
  Activity,
  LucideIcon,
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
  const menuItems = [
    { to: "/overview", icon: Home, label: "Overview" },
    { to: "/people", icon: Users, label: "Population" },
    { to: "/activities", icon: Activity, label: "Activities" },
    { to: "/buildings", icon: Hammer, label: "Buildings" },
    { to: "/market", icon: ShoppingCart, label: "Market Hall" },
    { to: "/military", icon: ShieldAlert, label: "Military" },
    { to: "/map", icon: Map, label: "Region Map" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border-main">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          City Management
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>

      {/* City Status Summary */}
      <NavLink
        to="/people"
        className="p-4 border-t border-border-main bg-bg-panel cursor-pointer transition-colors hover:bg-bg-main/20"
      >
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-text-muted">Idle Villagers</span>
            <span className="text-danger font-bold">2</span>
          </div>
          <div className="w-full bg-border-main h-1.5 rounded-full overflow-hidden">
            <div className="bg-danger h-full w-1/5" />
          </div>
        </div>
      </NavLink>
    </div>
  );
};

export default LeftSidebar;
