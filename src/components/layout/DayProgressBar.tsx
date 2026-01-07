import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { DAY_DURATION_MS, SEGMENT_DURATION_MS } from "../../helpers/game";

interface ZoneProps {
  startMs: number;
  endMs: number;
  currentProgressMs: number;
  colorClass: string;
  tooltipText: string;
}

const Zone: React.FC<ZoneProps> = ({
  startMs,
  currentProgressMs,
  colorClass,
  tooltipText,
}) => {
  const isVisible = currentProgressMs >= startMs;
  const zoneProgressMs = Math.max(
    0,
    Math.min(SEGMENT_DURATION_MS, currentProgressMs - startMs)
  );
  const progressPercent = (zoneProgressMs / SEGMENT_DURATION_MS) * 100;

  return (
    <div className="relative h-full flex-1 group">
      {/* Background of the zone (full width of the 1/3 segment) */}
      <div className="absolute inset-0 z-0 bg-transparent cursor-help" />

      {/* Progress fill */}
      {isVisible && (
        <div
          className={`absolute top-0 bottom-0 left-0 ${colorClass} transition-all duration-1000 ease-linear h-full z-10`}
          style={{ width: `${progressPercent}%` }}
        />
      )}

      {/* Tooltip - Always active on hover for the entire zone */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-zinc-900 border border-zinc-700 text-[10px] px-3 py-1.5 rounded shadow-2xl whitespace-nowrap z-50 animate-in fade-in zoom-in duration-200">
        {tooltipText}
      </div>
    </div>
  );
};

const DayProgressBar: React.FC = () => {
  const { dayTime } = useSelector((state: RootState) => state.game);

  return (
    <div className="w-full h-[10px] bg-zinc-800 flex relative overflow-visible border-b border-zinc-700">
      {/* Green zone */}
      <Zone
        startMs={0}
        endMs={SEGMENT_DURATION_MS}
        currentProgressMs={dayTime}
        colorClass="bg-gradient-to-r from-green-600 to-green-400"
        tooltipText="You can setup your population and run activities for today"
      />

      {/* Yellow zone */}
      <Zone
        startMs={SEGMENT_DURATION_MS}
        endMs={SEGMENT_DURATION_MS * 2}
        currentProgressMs={dayTime}
        colorClass="bg-gradient-to-r from-yellow-600 to-yellow-400"
        tooltipText="You can run activities for today"
      />

      {/* Red zone */}
      <Zone
        startMs={SEGMENT_DURATION_MS * 2}
        endMs={DAY_DURATION_MS}
        currentProgressMs={dayTime}
        colorClass="bg-gradient-to-r from-red-600 to-red-400"
        tooltipText="Activities are now stopped until the next day"
      />

      <div className="absolute top-0 bottom-0 w-[1px] bg-white/20 z-20 left-1/3" />
      <div className="absolute top-0 bottom-0 w-[1px] bg-white/20 z-20 left-2/3" />

      {/* Timer Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        <span className="relative top-2 pointer-all text-xs font-mono font-bold text-white bg-zinc-900 border border-zinc-700 shadow-xl px-3 py-1 rounded-md z-40">
          {Math.floor(dayTime / 60000)}:
          {Math.floor((dayTime % 60000) / 1000)
            .toString()
            .padStart(2, "0")}{" "}
          / 1:00
        </span>
      </div>
    </div>
  );
};

export default DayProgressBar;
