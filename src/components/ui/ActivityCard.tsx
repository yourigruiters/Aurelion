import React from "react";
import { ActivityInstance } from "../../store/activitiesSlice";
import { RESOURCE_ORDER } from "../../helpers/resource";
import Button from "./Button";
import {
  Sword,
  CheckCircle,
  ShieldAlert,
  Clock,
  ArrowUpCircle,
} from "lucide-react";
import ResourceDisplay from "../ui/ResourceDisplay";

interface ActivityCardProps {
  activity: ActivityInstance;
  onPerform: (id: string, type: "safe" | "risky") => void;
  userPower?: number; // Needed for risky analysis
  disabled?: boolean;
  canAfford?: boolean; // If we add costs later
  isSelected?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onPerform,
  userPower = 0,
  disabled = false,
  isSelected = false,
}) => {
  const isRisky = activity.type === "risky";
  const displayPower = activity.estimatedEnemyPower || activity.enemyPower || 0;

  // Calculate win chance for display (based on estimate)
  let winChance = 100;
  if (isRisky && displayPower > 0) {
    if (userPower === 0) winChance = 0;
    else if (userPower >= displayPower) winChance = 95;
    else winChance = Math.floor((userPower / displayPower) * 100);
  }

  return (
    <div
      className={`
      relative overflow-hidden rounded-lg border transition-all flex items-center p-4 gap-4
      ${
        activity.isCompleted || (disabled && !isSelected)
          ? "bg-bg-main border-border-main opacity-60 grayscale cursor-not-allowed"
          : isSelected
          ? "bg-bg-panel border-border-main shadow-sm"
          : isRisky
          ? "bg-bg-main border-border-main hover:border-danger hover:shadow-sm"
          : "bg-bg-main border-border-main hover:border-success hover:shadow-sm"
      }
    `}
    >
      {/* Icon */}
      <div
        className={`flex-none p-3 rounded-full border ${
          isRisky
            ? "bg-danger/10 border-danger/20 text-danger"
            : "bg-success/10 border-success/20 text-success"
        }`}
      >
        {isRisky ? <Sword size={24} /> : <CheckCircle size={24} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-lg text-text-main leading-none truncate">
            {activity.name}
          </h3>
        </div>
        <p className="text-sm text-text-secondary line-clamp-1">
          {activity.description}
        </p>

        {/* Duration for Risky Activities */}
        {isRisky && activity.durationDays && (
          <p className="text-xs font-mono text-text-muted mt-1 flex items-center gap-1">
            <Clock size={12} />
            <span className="text-text-main font-bold">
              {activity.durationDays}{" "}
              {activity.durationDays === 1 ? "day" : "days"}
            </span>
          </p>
        )}

        {/* Info Row: Rewards */}
        <div className="flex items-center gap-4 mt-2 text-xs">
          {/* Rewards Inline */}
          <div className="flex items-center gap-2">
            {Object.entries(activity.baseReward)
              .sort(
                (a, b) =>
                  RESOURCE_ORDER.indexOf(a[0]) - RESOURCE_ORDER.indexOf(b[0])
              )
              .map(([res, amount]) => (
                <ResourceDisplay
                  key={res}
                  resource={res}
                  amount={amount}
                  showPlus
                  className="text-text-main"
                />
              ))}
            {/* XP Reward */}
            {activity.xp && (
              <div className="flex items-center gap-1 text-text-main ml-2">
                <ArrowUpCircle size={14} className="text-brand" />
                <span className="font-bold">+{activity.xp}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Action / Stats */}
      <div className="flex-none flex flex-col items-end gap-2 w-32 md:w-48">
        {isRisky && !activity.isCompleted && !disabled && (
          <div className="flex flex-col items-end w-full">
            <div className="flex-1 flex items-center justify-end gap-1 text-xs text-text-muted mb-1">
              <Sword size={14} className="text-danger" />
              <span>
                Est. Attack Needed:{" "}
                <span className="font-bold">
                  ~{activity.estimatedEnemyPower || (activity.enemyPower ?? 0)}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <ShieldAlert
                size={14}
                className={
                  winChance > 75
                    ? "text-success"
                    : winChance > 40
                    ? "text-accent"
                    : "text-danger"
                }
              />
              <span
                className={`font-bold ${
                  winChance > 75
                    ? "text-success"
                    : winChance > 40
                    ? "text-accent"
                    : "text-danger"
                }`}
              >
                ~{winChance}% Win Chance
              </span>
            </div>
          </div>
        )}

        {activity.isCompleted ? (
          <div
            className={`w-full py-1.5 text-center text-xs font-bold border rounded ${
              activity.result === "success"
                ? "text-success border-success bg-success/5"
                : "text-danger border-danger bg-danger/5"
            }`}
          >
            {activity.result === "success" ? "Completed" : "Failed"}
          </div>
        ) : isSelected ? (
          <div className="text-xs font-bold text-text-main py-1.5 px-3"></div>
        ) : (
          <Button
            variant={isRisky ? "danger" : "secondary"}
            onClick={() => onPerform(activity.id, activity.type)}
            className="w-full text-xs py-1.5 h-8"
            disabled={disabled}
          >
            {isRisky ? "Raid Target" : "Start Task"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
