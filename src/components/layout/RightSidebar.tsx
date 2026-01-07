import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import {
  ShieldCheck,
  Skull,
  Hammer,
  FileText,
  Activity,
  ArrowUpCircle,
} from "lucide-react";
import DailyReportModal from "../ui/DailyReportModal";
import { DailyReport, markReportAsRead } from "../../store/reportsSlice";
import clsx from "clsx";
import { MILITARY_TECHS } from "../../store/militarySlice";
import { RESOURCE_ORDER } from "../../helpers/resource";
import ResourceDisplay from "../ui/ResourceDisplay";

const RightSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { activeSafeActivity, activeRiskyActivity } = useSelector(
    (state: RootState) => state.activities
  );

  const { constructionQueue } = useSelector(
    (state: RootState) => state.buildings
  );
  const { reports } = useSelector((state: RootState) => state.reports);
  const { activeResearch } = useSelector((state: RootState) => state.military);

  const [selectedReport, setSelectedReport] =
    React.useState<DailyReport | null>(null);
  const dispatch = useDispatch();

  const handleOpenReport = (report: DailyReport) => {
    setSelectedReport(report);
    if (!report.read) {
      dispatch(markReportAsRead(report.id));
    }
  };

  const handleCloseReport = () => {
    setSelectedReport(null);
  };

  const goto = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col h-full bg-bg-panel border-l border-border-main">
      {/* 1. Reports */}
      <div className="flex-none p-4 pb-2 border-b border-border-main max-h-[30%] overflow-y-auto">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 sticky top-0 bg-bg-panel z-10 flex items-center gap-2">
          <FileText size={14} />
          Reports
        </h2>
        <div className="space-y-2">
          {reports.slice(0, 2).map((report, index) => (
            <div
              key={report.id}
              onClick={() => handleOpenReport(report)}
              className={clsx(
                "p-3 bg-bg-main rounded border-l-2 transition-colors cursor-pointer group",
                report.read
                  ? "border-transparent opacity-60 hover:opacity-100"
                  : "border-brand"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-text-main flex items-center gap-2">
                  <FileText
                    size={14}
                    className={clsx(
                      "group-hover:text-brand-hover",
                      report.read ? "text-text-muted" : "text-brand"
                    )}
                  />
                  {index === 0 ? "Today" : "Yesterday"}
                </h4>
              </div>
              <p className="text-xs text-text-secondary line-clamp-1">
                {report.nightEvent
                  ? `Event: ${report.nightEvent.title}`
                  : "A quiet night."}
              </p>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="text-sm text-text-dim italic">No reports yet.</div>
          )}
        </div>
      </div>

      {/* 2. Running Activities */}
      <div className="p-4 border-b border-border-main">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity size={14} />
          Running Activities{" "}
        </h2>
        <div className="space-y-3">
          {!activeSafeActivity && !activeRiskyActivity && (
            <div className="text-sm text-text-dim italic py-2">
              No active tasks
            </div>
          )}

          {activeSafeActivity && (
            <div
              onClick={() => goto("/activities")}
              className="bg-bg-main p-3 rounded border border-success/30 cursor-pointer hover:bg-bg-panel transition-colors"
            >
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
                {Object.entries(activeSafeActivity.baseReward)
                  .sort(
                    (a, b) =>
                      RESOURCE_ORDER.indexOf(a[0]) -
                      RESOURCE_ORDER.indexOf(b[0])
                  )
                  .map(([res, amount]) => (
                    <ResourceDisplay
                      key={res}
                      resource={res}
                      amount={amount}
                      showPlus
                      size="sm"
                      className="text-text-secondary"
                    />
                  ))}
                {activeSafeActivity.xp && (
                  <div className="flex items-center gap-1 text-xs text-brand">
                    <ArrowUpCircle size={12} />
                    <span>+{activeSafeActivity.xp}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeRiskyActivity && (
            <div
              onClick={() => goto("/activities")}
              className="bg-bg-main p-3 rounded border border-danger/30 cursor-pointer hover:bg-bg-panel transition-colors"
            >
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
                {Object.entries(activeRiskyActivity.baseReward)
                  .sort(
                    (a, b) =>
                      RESOURCE_ORDER.indexOf(a[0]) -
                      RESOURCE_ORDER.indexOf(b[0])
                  )
                  .map(([res, amount]) => (
                    <ResourceDisplay
                      key={res}
                      resource={res}
                      amount={amount}
                      showPlus
                      size="sm"
                      className="text-text-secondary"
                    />
                  ))}
                {activeRiskyActivity.xp && (
                  <div className="flex items-center gap-1 text-xs text-brand">
                    <ArrowUpCircle size={12} />
                    <span>+{activeRiskyActivity.xp}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Construction Queue */}
      <div className="p-4 border-b border-border-main">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
          <Hammer size={14} />
          Construction Queue
        </h2>
        {constructionQueue.length === 0 ? (
          <div className="text-sm text-text-dim italic py-2">
            No active construction
          </div>
        ) : (
          <div className="space-y-3">
            {constructionQueue.map((item) => (
              <div
                key={item.id}
                onClick={() => goto("/buildings")}
                className="bg-bg-main p-3 rounded border border-brand/30 cursor-pointer hover:bg-bg-panel transition-colors"
              >
                <div className="flex items-center gap-2 mb-1 justify-between">
                  <div className="flex items-center gap-2">
                    <Hammer size={16} className="text-brand" />
                    <span className="text-sm font-bold text-brand">
                      Construction
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary font-mono">
                    {item.remainingDays}d left
                  </span>
                </div>
                <p className="text-sm text-text-main font-medium mb-1">
                  {item.name}
                </p>
                {item.totalDays > 1 && (
                  <div className="h-1.5 w-full bg-bg-panel rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-brand transition-all duration-500"
                      style={{
                        width: `${
                          ((item.totalDays - item.remainingDays) /
                            item.totalDays) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Military Research */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
          <ShieldCheck size={14} />
          Military Research
        </h2>
        {activeResearch ? (
          <div
            onClick={() => goto("/military")}
            className="bg-bg-main p-3 rounded border border-brand/30 cursor-pointer hover:bg-bg-panel transition-colors"
          >
            <div className="flex items-center gap-2 mb-1 justify-between">
              <span className="text-sm font-bold text-brand">
                {MILITARY_TECHS[activeResearch.techId]?.name}
              </span>
              <span className="text-xs text-text-secondary font-mono">
                {activeResearch.remainingDays}d left
              </span>
            </div>
            <p className="text-xs text-text-secondary mb-2">
              {MILITARY_TECHS[activeResearch.techId]?.description}
            </p>
            {activeResearch.totalDays > 1 && (
              <div className="h-1.5 w-full bg-bg-panel rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-brand transition-all duration-500"
                  style={{
                    width: `${
                      ((activeResearch.totalDays -
                        activeResearch.remainingDays) /
                        activeResearch.totalDays) *
                      100
                    }%`,
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-text-dim italic py-2">
            No military research
          </div>
        )}
      </div>

      {selectedReport && (
        <DailyReportModal report={selectedReport} onClose={handleCloseReport} />
      )}
    </div>
  );
};

export default RightSidebar;
