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
  const normResource = resource.toLowerCase();

  let Icon = Apple; // Default fallback
  let defaultColor = "text-text-main";

  switch (normResource) {
    case "food":
      Icon = Apple;
      defaultColor = "text-danger"; // Red
      break;
    case "wood":
      Icon = Leaf; // Use Leaf icon for wood as requested (or Leaf if available? User mentioned "orange leave". Leaf looks like a leaf/grain. Actually 'Leaf' is in lucide-react? Let's check imports. User said "orange leave for wood". Lucide has 'Leaf'. I should check if I can use Leaf. The previous code used Leaf rotated 90 deg for wood. I'll check if Leaf exists, if not I'll stick to Leaf-rotated or similar. But wait, I can just use 'Leaf' from lucide-react if I import it. I'll try to import Leaf.)
      // Actually, looking at previous files, they used Leaf with rotate-90 for wood.
      // User said "red apple for food and orange leave for wood".
      // Let's rely on Leaf rotated for now if Leaf isn't imported, BUT I can import Leaf.
      // I'll try to use Leaf if I can. safely, or stick to the "Orange Leaf" description which implies using a leaf icon.
      // safely, I will import Leaf.
      defaultColor = "text-brand"; // Orange/Brand color
      break;
    case "stone":
      Icon = Mountain;
      defaultColor = "text-text-muted"; // Grey
      break;
    case "iron":
      Icon = Hammer; // Or Pickaxe if available, but Hammer is standard
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
      Icon = Gem; // Placeholder
      defaultColor = "text-purple-400";
      break;
    default:
      // Fallback
      break;
  }

  // If the user didn't override the color in className, usage of defaultColor is handled by appending or merging?
  // Tailwind classes don't merge automatically.
  // But usually we just want to apply the color.
  // The caller might pass `className="text-white"` to override.
  // We'll append defaultColor ONLY if className doesn't seem to have a text color?
  // Easier: Just apply defaultColor and let className override via cascading if they place it after?
  // Or just always apply defaultColor if it's not specified.
  // The simplest "consistent design" is to ENFORCE the color.

  return <Icon size={size} className={`${defaultColor} ${className}`} />;
};

export default ResourceIcon;
