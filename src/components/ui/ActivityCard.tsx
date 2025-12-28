import React from "react";
import { ActivityInstance } from "../../store/activitiesSlice";
import Button from "./Button";
import {
  Sword,
  CheckCircle,
  ShieldAlert,
  Wheat,
  Coins,
  Mountain,
  Hammer,
} from "lucide-react";

interface ActivityCardProps {
  activity: ActivityInstance;
  onPerform: (id: string, type: "safe" | "risky") => void;
  userPower?: number; // Needed for risky analysis
  canAfford?: boolean; // If we add costs later
}

const ResourceIcon = ({ resource }: { resource: string }) => {
  switch (resource) {
    case "food":
      return <Wheat size={14} className="text-danger-light" />;
    case "wood":
      return <Wheat size={14} className="text-brand rotate-90" />;
    case "stone":
      return <Mountain size={14} className="text-text-muted" />;
    case "iron":
      return <Hammer size={14} className="text-text-secondary" />;
    case "gold":
      return <Coins size={14} className="text-accent" />;
    default:
      return null;
  }
};

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onPerform,
  userPower = 0,
}) => {
  const isRisky = activity.type === "risky";
  const enemyPower = activity.enemyPower || 0;

  // Calculate win chance for display (simple logic: User >= Enemy = 100%, else proportional)
  let winChance = 100;
  if (isRisky && enemyPower > 0) {
    if (userPower === 0) winChance = 0;
    else if (userPower >= enemyPower) winChance = 95; // Always some risk?
    else winChance = Math.floor((userPower / enemyPower) * 100);
  }

  return (
    <div
      className={`
      relative overflow-hidden rounded-lg border transition-all
      ${
        activity.isCompleted
          ? "bg-bg-main border-border-main opacity-60 grayscale"
          : isRisky
          ? "bg-bg-panel border-danger/30 hover:border-danger hover:shadow-lg hover:shadow-danger/10"
          : "bg-bg-panel border-success/30 hover:border-success hover:shadow-lg hover:shadow-success/10"
      }
    `}
    >
      {/* Risk Badge */}
      <div
        className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg
        ${isRisky ? "bg-danger text-white" : "bg-success text-white"}
      `}
      >
        {isRisky ? "Dangerous" : "Safe"}
      </div>

      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`p-3 rounded-full ${
              isRisky
                ? "bg-danger/20 text-danger"
                : "bg-success/20 text-success"
            }`}
          >
            {isRisky ? <Sword size={24} /> : <CheckCircle size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-lg text-text-main leading-none mb-1">
              {activity.name}
            </h3>
            <p className="text-sm text-text-secondary line-clamp-2">
              {activity.description}
            </p>
          </div>
        </div>

        {/* Stats / Info */}
        <div className="flex-1 space-y-3 mb-4">
          {/* Reward Preview */}
          <div className="bg-bg-main p-2 rounded border border-border-light flex flex-wrap gap-3">
            <span className="text-xs font-bold text-text-muted w-full">
              Rewards:
            </span>
            {Object.entries(activity.baseReward).map(([res, amount]) => (
              <div
                key={res}
                className="flex items-center gap-1.5 text-sm text-text-main bg-bg-panel px-2 py-0.5 rounded border border-border-main"
              >
                <ResourceIcon resource={res} />
                <span className="capitalize">{res}</span>
                <span className="font-bold">+{amount}</span>
              </div>
            ))}
          </div>

          {/* Risk Analysis */}
          {isRisky && !activity.isCompleted && (
            <div className="flex items-center gap-2 text-sm bg-bg-main p-2 rounded border border-border-light">
              <ShieldAlert
                size={16}
                className={
                  winChance > 75
                    ? "text-success"
                    : winChance > 40
                    ? "text-accent"
                    : "text-danger"
                }
              />
              <span className="text-text-muted">Analyze:</span>
              <span
                className={`font-bold ${
                  winChance > 75
                    ? "text-success"
                    : winChance > 40
                    ? "text-accent"
                    : "text-danger"
                }`}
              >
                {winChance}% Win Rate
              </span>
              <span className="text-xs text-text-secondary ml-auto">
                (Str: {userPower} vs {enemyPower})
              </span>
            </div>
          )}
        </div>

        {/* Action */}
        <div>
          {activity.isCompleted ? (
            <div
              className={`w-full py-2 text-center font-bold border rounded bg-bg-main ${
                activity.result === "success"
                  ? "text-success border-success"
                  : "text-danger border-danger"
              }`}
            >
              {activity.result === "success" ? "Completed" : "Failed"}
            </div>
          ) : (
            <Button
              variant={isRisky ? "danger" : "secondary"}
              onClick={() => onPerform(activity.id, activity.type)}
              className="w-full text-sm py-2"
            >
              {isRisky ? "Raid Target" : "Start Task"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
