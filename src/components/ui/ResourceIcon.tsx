import React from "react";
import {
  Leaf, // Wood
  Apple, // Food
  Mountain, // Stone
  Hammer, // Iron
  Coins, // Gold
  Users, // Population
  Gem, // Gems/Prestige if needed, usually Gold uses Coins
  Swords, // Attack/Military
  Shield, // Defense
} from "lucide-react";

interface ResourceIconProps {
  resource: string;
  size?: number;
  className?: string;
}

const ResourceIcon: React.FC<ResourceIconProps> = ({
  resource,
  size = 14,
  className = "",
}) => {
  if (!resource) return null;
  const normResource = resource.toLowerCase();

  let Icon = Apple; // Default fallback
  let defaultColor = "text-text-main";

  switch (normResource) {
    case "food":
      Icon = Apple;
      defaultColor = "text-danger"; // Red
      break;
    case "wood":
      Icon = Leaf;
      defaultColor = "text-brand"; // Orange/Brand color
      break;
    case "stone":
      Icon = Mountain;
      defaultColor = "text-text-muted"; // Grey
      break;
    case "iron":
      Icon = Hammer;
      defaultColor = "text-text-secondary"; // Darker Grey
      break;
    case "gold":
      Icon = Coins;
      defaultColor = "text-accent"; // Yellow/Gold
      break;
    case "population":
    case "villager":
      Icon = Users;
      defaultColor = "text-blue-400";
      break;
    case "attack":
    case "military":
      Icon = Swords;
      defaultColor = "text-danger";
      break;
    case "defense":
      Icon = Shield;
      defaultColor = "text-blue-500";
      break;
    case "xp":
    case "express":
      Icon = Gem;
      defaultColor = "text-purple-400";
      break;
    default:
      // Fallback
      break;
  }

  return <Icon size={size} className={`${defaultColor} ${className}`} />;
};

export default ResourceIcon;
