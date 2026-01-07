import React from "react";
import ResourceIcon from "./ResourceIcon";

interface ResourceDisplayProps {
  resource: string;
  amount: number;
  showPlus?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  iconClassName?: string;
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({
  resource,
  amount,
  showPlus = false,
  size = "sm",
  className = "",
  iconClassName = "",
}) => {
  // Sizing
  const textSize =
    size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";
  const iconSize = size === "sm" ? 14 : size === "md" ? 16 : 20;

  // Formatting
  const isPositive = amount > 0;
  const prefix = showPlus && isPositive ? "+" : "";
  const formattedAmount = `${prefix}${amount}`;

  return (
    <div className={`flex items-center gap-1 ${textSize} ${className}`}>
      <ResourceIcon
        resource={resource}
        size={iconSize}
        className={iconClassName}
      />
      <span className="font-bold">{formattedAmount}</span>
    </div>
  );
};

export default ResourceDisplay;
