import React from "react";

interface NotificationProps {
  title: string;
  time: string;
  type?: string;
}

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

const RightSidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-bg-panel border-l border-border-main">
      {/* Running Activities */}
      <div className="p-4 border-b border-border-main">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Running Activities
        </h2>
        <div className="text-sm text-text-dim italic py-2">No active tasks</div>
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
