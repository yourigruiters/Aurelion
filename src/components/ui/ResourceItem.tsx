import React from "react";
import { ChevronUp, ChevronDown, LucideIcon } from "lucide-react";
import ResourceIcon from "./ResourceIcon";

interface ResourceItemProps {
  resource: string;
  value: number;
  rate?: number;
  modifier?: number;
  color?: string; // Optional override
  tooltipLabel?: React.ReactNode;
  className?: string;
  customValueDisplay?: React.ReactNode;
  max?: number;
  loss?: number;
  buildingModifier?: number;
  bonusModifier?: number;
}

const ResourceItem: React.FC<ResourceItemProps> = ({
  resource,
  value,
  rate,
  modifier,
  loss, // Destructure loss
  color,
  tooltipLabel,
  className = "",
  customValueDisplay,
  buildingModifier,
  bonusModifier,
}) => {
  // Calculate Net Rate
  const baseRate = rate || 0;
  const mod = modifier || 1;
  const production = baseRate * mod;
  const totalLoss = loss || 0;
  const netRate = production - totalLoss;

  // Determine arrow based on NET rate
  let ArrowIcon: LucideIcon | null = null;
  let arrowColor = "";

  if (rate !== undefined || loss !== undefined) {
    if (netRate > 0) {
      ArrowIcon = ChevronUp;
      arrowColor = "text-success";
    } else if (netRate < 0) {
      ArrowIcon = ChevronDown;
      arrowColor = "text-danger";
    }
  }

  return (
    <div
      className={`group relative flex items-center space-x-1.5 bg-bg-panel/50 px-2 py-1 rounded cursor-default border border-transparent hover:border-border-light transition-colors ${className}`}
    >
      <ResourceIcon resource={resource} size={16} className={color} />
      <span className="text-sm font-medium">
        {customValueDisplay || Math.floor(value)}
      </span>
      {ArrowIcon && <ArrowIcon size={12} className={arrowColor} />}

      {/* Tooltip */}
      {(tooltipLabel || rate !== undefined || loss !== undefined) && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-bg-main border border-border-main shadow-xl rounded p-2 text-xs z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {tooltipLabel && (
            <div className="font-bold mb-1 text-text-secondary">
              {tooltipLabel}
            </div>
          )}

          {/* Income (Base Production) */}
          {rate !== undefined && rate > 0 && (
            <div className="flex justify-between text-success">
              <span>Base:</span>
              <span>+{rate}</span>
            </div>
          )}

          {/* Breakdown Display */}
          {(buildingModifier || 0) > 0 && (
            <div className="flex justify-between text-info mt-1">
              <span>Building Mod:</span>
              <span>+{Math.round((buildingModifier || 0) * 100)}%</span>
            </div>
          )}
          {(bonusModifier || 0) > 0 && (
            <div className="flex justify-between text-purple-400 mt-1">
              <span>Bonus Mod:</span>
              <span>+{Math.round((bonusModifier || 0) * 100)}%</span>
            </div>
          )}

          {/* Total Modifier Display */}
          {modifier !== undefined && modifier !== 1 && (
            <div className="flex justify-between text-text-main font-bold mt-1 pt-1 border-t border-border-light/20">
              <span>Total Mod:</span>
              <span>
                {(() => {
                  const pct = Math.round((modifier - 1) * 100);
                  return pct > 0 ? `+${pct}%` : `${pct}%`;
                })()}
              </span>
            </div>
          )}

          {/* Gross Production (if modifier present) */}
          {modifier !== undefined &&
            modifier !== 1 &&
            rate !== undefined &&
            rate > 0 && (
              <div className="flex justify-between text-success mt-1 pt-1 border-t border-border-light">
                <span>Gross:</span>
                <span>+{Math.floor(production)}</span>
              </div>
            )}

          {/* Loss */}
          {loss !== undefined && loss > 0 && (
            <div className="flex justify-between text-danger">
              <span>Consumption:</span>
              <span>-{loss}</span>
            </div>
          )}

          {/* Net Change Line (only if rate or loss exists) */}
          {(rate !== undefined || loss !== undefined) && (
            <div className="mt-2 pt-2 border-t border-border-light flex justify-between font-bold text-text-main">
              <span>Net:</span>
              <span className={netRate >= 0 ? "text-success" : "text-danger"}>
                {netRate > 0 ? "+" : ""}
                {Math.floor(netRate)} / day
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceItem;
