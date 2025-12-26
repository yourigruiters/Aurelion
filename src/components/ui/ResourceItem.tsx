import React from "react";
import { ChevronUp, ChevronDown, LucideIcon } from "lucide-react";

interface ResourceItemProps {
  icon: LucideIcon;
  value: number;
  rate?: number;
  color?: string;
  tooltipLabel?: string;
  className?: string;
}

const ResourceItem: React.FC<ResourceItemProps> = ({
  icon: Icon,
  value,
  rate,
  color,
  tooltipLabel,
  className = "",
}) => {
  // Determine arrow
  let ArrowIcon: LucideIcon | null = null;
  let arrowColor = "";

  if (rate !== undefined) {
    if (rate > 0) {
      ArrowIcon = ChevronUp;
      arrowColor = "text-success";
    } else if (rate < 0) {
      ArrowIcon = ChevronDown;
      arrowColor = "text-danger";
    }
  }

  return (
    <div
      className={`group relative flex items-center space-x-1.5 bg-bg-panel/50 px-2 py-1 rounded cursor-default border border-transparent hover:border-border-light transition-colors ${className}`}
    >
      <Icon size={16} className={color} />
      <span className="text-sm font-medium">{Math.floor(value)}</span>
      {ArrowIcon && <ArrowIcon size={12} className={arrowColor} />}

      {/* Tooltip */}
      {tooltipLabel && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-bg-main border border-border-main shadow-xl rounded p-2 text-xs z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="font-bold mb-1 text-text-secondary">
            {tooltipLabel}
          </div>
          {rate !== undefined && (
            <>
              <div className="flex justify-between text-success">
                <span>Income:</span>
                <span>+{rate > 0 ? rate : 0} / day</span>
              </div>
              <div className="flex justify-between text-danger-light">
                <span>Use:</span>
                <span>{rate < 0 ? rate : 0} / day</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceItem;
