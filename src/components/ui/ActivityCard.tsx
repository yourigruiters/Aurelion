import { useSelector } from "react-redux";
import { ActivityInstance } from "../../store/activitiesSlice";
import Button from "./Button";
import { RootState } from "../../store/store";
import { DAY_DURATION_MS } from "../../helpers/game";
import {
  Sword,
  CheckCircle,
  ShieldAlert,
  Wheat,
  Coins,
  Mountain,
  Hammer,
  Clock, // Added Clock
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

  // Access dayTime from store for "Time Remaining" (Expires in)
  // Note: We might want to pass this as a prop to avoid selecting in every card if we map many,
  // but for simplicity/cleanness inside the card, we can select or assume passed.
  // Let's assume we pass it or select it. Since it's not in props, let's select.
  // Actually, selecting in a map list is okay for small lists.
  // Wait, I can't select inside here without importing useSelector.
  // Let's modify props to include `expiresIn`.
  // Or just pick it here.
  // Adding useSelector:
  const dayTime = useSelector((state: RootState) => state.game.dayTime);
  const timeLeftMs = DAY_DURATION_MS - dayTime;
  const timeDisplay = `${Math.floor(timeLeftMs / 60000)}:${Math.floor(
    (timeLeftMs % 60000) / 1000
  )
    .toString()
    .padStart(2, "0")}`;

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
      relative overflow-hidden rounded-lg border transition-all flex items-center p-4 gap-4
      ${
        activity.isCompleted
          ? "bg-bg-main border-border-main opacity-60 grayscale"
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
          <div
            className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider
            ${
              isRisky
                ? "bg-danger/20 text-danger"
                : "bg-success/20 text-success"
            }
          `}
          >
            {isRisky ? "Dangerous" : "Safe"}
          </div>
        </div>
        <p className="text-sm text-text-secondary line-clamp-1">
          {activity.description}
        </p>

        {/* Info Row: Time & Rewards */}
        <div className="flex items-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1 text-text-muted font-mono">
            <Clock size={12} />
            <span>Expires: {timeDisplay}</span>
          </div>

          {/* Rewards Inline */}
          <div className="flex items-center gap-2">
            {Object.entries(activity.baseReward).map(([res, amount]) => (
              <div key={res} className="flex items-center gap-1 text-text-main">
                <ResourceIcon resource={res} />
                <span className="font-bold">+{amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Action / Stats */}
      <div className="flex-none flex flex-col items-end gap-2 w-32 md:w-48">
        {isRisky && !activity.isCompleted && (
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
              {winChance}% Win Rate
            </span>
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
        ) : (
          <Button
            variant={isRisky ? "danger" : "secondary"} // "secondary" or "outline" creates standard look
            onClick={() => onPerform(activity.id, activity.type)}
            className="w-full text-xs py-1.5 h-8"
          >
            {isRisky ? "Raid Target" : "Start Task"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
