import React from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  Hammer,
  ShoppingCart,
  Map,
  Home,
  ShieldAlert,
} from "lucide-react";

const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
        isActive
          ? "bg-zinc-700 text-yellow-500 border-r-2 border-yellow-500"
          : "text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200"
      }`
    }
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
);

const LeftSidebar = () => {
  const menuItems = [
    { to: "/overview", icon: Home, label: "Overview" },
    { to: "/people", icon: Users, label: "Population" },
    { to: "/buildings", icon: Hammer, label: "Buildings" },
    { to: "/market", icon: ShoppingCart, label: "Market Hall" },
    { to: "/military", icon: ShieldAlert, label: "Military" },
    { to: "/map", icon: Map, label: "Region Map" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-zinc-700">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
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
      <div className="p-4 border-t border-zinc-700 bg-zinc-800/50">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Idle Villagers</span>
            <span className="text-orange-400 font-bold">2</span>
          </div>
          <div className="w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full w-1/5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
