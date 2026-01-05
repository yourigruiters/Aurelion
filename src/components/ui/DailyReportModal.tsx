import React from "react";
import { DailyReport } from "../../store/reportsSlice";
import {
  X,
  Moon,
  ArrowUpCircle,
  Wheat,
  Coins,
  Mountain,
  Hammer,
  Skull,
  ShieldCheck,
} from "lucide-react";

interface DailyReportModalProps {
  report: DailyReport;
  onClose: () => void;
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

const DailyReportModal: React.FC<DailyReportModalProps> = ({
  report,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-bg-panel border border-border-main rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-main">
          <div>
            <h2 className="text-lg font-bold text-text-main">Daily Report</h2>
            <p className="text-xs text-text-muted uppercase tracking-wider font-mono">
              {report.date}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Night Event */}
          {report.nightEvent ? (
            <div className="bg-bg-dark rounded-lg p-4 border border-border-light relative overflow-hidden">
              <div className="flex items-start gap-3 relative z-10">
                <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-400">
                  <Moon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-text-main">
                    {report.nightEvent.title}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {report.nightEvent.description}
                  </p>
                  {report.nightEvent.effect && (
                    <div className="flex gap-3 mt-2">
                      {Object.entries(report.nightEvent.effect).map(
                        ([res, amount]) => (
                          <div
                            key={res}
                            className={`text-xs font-bold flex items-center gap-1 ${
                              amount > 0 ? "text-success" : "text-danger"
                            }`}
                          >
                            <ResourceIcon resource={res} />
                            {amount > 0 ? "+" : ""}
                            {amount}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-text-muted italic border border-dashed border-border-light rounded-lg">
              The night was peaceful.
            </div>
          )}

          {/* Level Info */}
          <div className="flex items-center gap-4 bg-bg-main p-3 rounded-lg border border-border-light">
            <div className="p-2 bg-brand/10 text-brand rounded-full">
              <ArrowUpCircle size={20} />
            </div>
            <div>
              <div className="text-xs text-text-muted uppercase">
                Level Progress
              </div>
              <div className="text-sm font-bold text-text-main">
                Level {report.levelInfo.level}
                <span className="text-text-secondary font-normal ml-2">
                  (+{report.levelInfo.expGained} XP today)
                </span>
              </div>
            </div>
          </div>

          {/* Resource Gains */}
          <div>
            <h3 className="text-sm font-bold text-text-main mb-3 uppercase tracking-wider">
              Resource Changes
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(report.resourcesGained).length > 0 ? (
                Object.entries(report.resourcesGained).map(([res, amount]) => (
                  <div
                    key={res}
                    className="flex items-center gap-2 p-2 bg-bg-main rounded border border-border-light"
                  >
                    <ResourceIcon resource={res} />
                    <span
                      className={`text-sm font-bold ${
                        amount >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {amount > 0 ? "+" : ""}
                      {amount}
                    </span>
                    <span className="text-xs text-text-muted capitalize">
                      {res}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-sm text-text-muted italic">
                  No resource changes recorded.
                </div>
              )}
            </div>
          </div>

          {/* Activities Feedback */}
          <div>
            <h3 className="text-sm font-bold text-text-main mb-3 uppercase tracking-wider">
              Activity Log
            </h3>
            <div className="space-y-2">
              {report.activitiesCompleted.length > 0 ? (
                report.activitiesCompleted.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-bg-main rounded border border-border-light"
                  >
                    {activity.type === "risky" ? (
                      <Skull size={16} className="text-danger" />
                    ) : (
                      <ShieldCheck size={16} className="text-success" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-bold text-text-main">
                        {activity.name}
                      </div>
                      <div
                        className={`text-xs ${
                          activity.result === "success"
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {activity.result === "success"
                          ? "Completed successfully"
                          : "Failed"}
                      </div>
                    </div>
                    {/* Rewards diff display? Or just result */}
                    {activity.result === "success" && (
                      <div className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          {Object.entries(activity.rewards).map(
                            ([res, amt]) => (
                              <div
                                key={res}
                                className="flex items-center gap-1 text-xs text-text-secondary"
                              >
                                <ResourceIcon resource={res} /> +{amt}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-text-muted italic">
                  No activities completed today.
                </div>
              )}
            </div>
          </div>

          {/* Construction Queue (Mocked for now) */}
          <div>
            <h3 className="text-sm font-bold text-text-main mb-3 uppercase tracking-wider">
              Construction Queue
            </h3>
            {report.completedConstructions &&
            report.completedConstructions.length > 0 ? (
              <div className="space-y-2">
                {report.completedConstructions.map((name, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-bg-main rounded border border-success/30"
                  >
                    <Hammer size={16} className="text-success" />
                    <span className="text-sm font-bold text-text-main">
                      {name}
                    </span>
                    <span className="ml-auto text-xs text-success font-bold uppercase">
                      Finished
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-text-muted italic">
                No construction projects were completed today.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReportModal;
