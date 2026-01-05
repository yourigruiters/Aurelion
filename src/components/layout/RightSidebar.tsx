import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  Loader,
  ShieldCheck,
  Skull,
  Wheat,
  Coins,
  Mountain,
  Hammer,
} from "lucide-react";

interface NotificationProps {
  title: string;
  time: string;
  type?: string;
}

const ResourceIcon = ({ resource }: { resource: string }) => {
  switch (resource) {
    case "food":
      return <Wheat size={12} className="text-danger-light" />;
    case "wood":
      return <Wheat size={12} className="text-brand rotate-90" />;
    case "stone":
      return <Mountain size={12} className="text-text-muted" />;
    case "iron":
      return <Hammer size={12} className="text-text-secondary" />;
    case "gold":
      return <Coins size={12} className="text-accent" />;
    default:
      return null;
  }
};

const Notification: React.FC<NotificationProps> = ({
  title,
  time,
  type: _type,
}) => (
  <div className="p-3 bg-bg-main rounded border-l-2 border-border-light hover:bg-bg-panel transition-colors cursor-pointer">
    <h4 className="text-sm font-medium text-text-main">{title}</h4>
    <span className="text-xs text-text-muted">{time}</span>
  </div>
);

// ... Notification component ...

const RightSidebar: React.FC = () => {
  const { activeSafeActivity, activeRiskyActivity } = useSelector(
    (state: RootState) => state.activities
  );

  return (
    <div className="flex flex-col h-full bg-bg-panel border-l border-border-main">
      {/* Running Activities */}
      <div className="p-4 border-b border-border-main">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
          Running Activities{" "}
          {(activeSafeActivity || activeRiskyActivity) && (
            <Loader size={12} className="animate-spin" />
          )}
        </h2>
        <div className="space-y-3">
          {!activeSafeActivity && !activeRiskyActivity && (
            <div className="text-sm text-text-dim italic py-2">
              No active tasks
            </div>
          )}

          {activeSafeActivity && (
            <div className="bg-bg-main p-3 rounded border border-success/30">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={16} className="text-success" />
                <span className="text-sm font-bold text-success">
                  Daily task
                </span>
              </div>
              <p className="text-sm text-text-main font-medium mb-2">
                {activeSafeActivity.name}
              </p>
              {/* Rewards */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border-light">
                {Object.entries(activeSafeActivity.baseReward).map(
                  ([res, amount]) => (
                    <div
                      key={res}
                      className="flex items-center gap-1 text-xs text-text-secondary"
                    >
                      <ResourceIcon resource={res} />
                      <span>+{amount}</span>
                    </div>
                  )
                )}
                {activeSafeActivity.xp && (
                  <div className="flex items-center gap-1 text-xs text-brand">
                    <span className="font-bold text-[10px]">XP</span>
                    <span>+{activeSafeActivity.xp}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeRiskyActivity && (
            <div className="bg-bg-main p-3 rounded border border-danger/30">
              <div className="flex items-center gap-2 mb-1 justify-between">
                <div className="flex items-center gap-2">
                  <Skull size={16} className="text-danger" />
                  <span className="text-sm font-bold text-danger">
                    Expedition
                  </span>
                </div>
                <span className="text-xs text-text-secondary font-mono">
                  {activeRiskyActivity.remainingDays}d left
                </span>
              </div>
              <p className="text-sm text-text-main font-medium mb-2">
                {activeRiskyActivity.name}
              </p>
              {/* Rewards */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border-light">
                {Object.entries(activeRiskyActivity.baseReward).map(
                  ([res, amount]) => (
                    <div
                      key={res}
                      className="flex items-center gap-1 text-xs text-text-secondary"
                    >
                      <ResourceIcon resource={res} />
                      <span>+{amount}</span>
                    </div>
                  )
                )}
                {activeRiskyActivity.xp && (
                  <div className="flex items-center gap-1 text-xs text-brand">
                    <span className="font-bold text-[10px]">XP</span>
                    <span>+{activeRiskyActivity.xp}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Construction Queue */}
      <div className="p-4 border-b border-border-main">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Construction Queue
        </h2>
        <div className="text-sm text-text-dim italic py-2">
          No active construction
        </div>
      </div>

      {/* Notifications */}
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 bg-bg-panel p-4 pb-2 z-10">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Notifications
          </h2>
        </div>
        <div className="px-4 pb-4 space-y-2">
          <Notification title="Daily report generated" time="2m ago" />
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
