import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock,
  Users,
  Activity,
  BookOpen,
  ArrowRight,
  Hammer,
  Shield,
  Map,
  Swords,
} from "lucide-react";
import { RootState } from "../store/store";
import { DAY_DURATION_MS, SEGMENT_DURATION_MS } from "../helpers/game";

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const { dayTime } = useSelector((state: RootState) => state.game);
  const { population, assignments } = useSelector(
    (state: RootState) => state.resources
  );
  const { activeSafeActivity, activeRiskyActivity } = useSelector(
    (state: RootState) => state.activities
  );
  const { totalAttackBonus, totalDefenseBonus } = useSelector(
    (state: RootState) => state.military
  );

  const activeCount =
    (activeSafeActivity ? 1 : 0) + (activeRiskyActivity ? 1 : 0);

  // Calculate Military Stats
  const warriorCount = Number(assignments["Warrior"] || 0);
  const attackValue = Math.floor(warriorCount * (1 + (totalAttackBonus || 0)));
  const defenseValue = totalDefenseBonus || 0;

  // Calculate Phase
  const getPhaseInfo = () => {
    if (dayTime < SEGMENT_DURATION_MS) {
      return {
        name: "Morning: Setup",
        description: "Assign population.",
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
      };
    } else if (dayTime < SEGMENT_DURATION_MS * 2) {
      return {
        name: "Day: Activities",
        description: "Run activities and expeditions.",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
      };
    } else {
      return {
        name: "Evening: Defense",
        description: "Prepare for night raids and manage buildings.",
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
      };
    }
  };

  const phase = getPhaseInfo();

  /* 
    Calculate unassigned population for quick status
    Total - sum(assignments)
  */
  const totalAssigned = Object.values(assignments).reduce((a, b) => a + b, 0);
  const unassigned = Math.max(0, population - totalAssigned);

  return (
    <div className="h-full w-full p-6 overflow-y-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main">City Overview</h1>
          <p className="text-text-secondary mt-1">
            Status report and daily command center.
          </p>
        </div>
        <button
          onClick={() => navigate("/players-guide")}
          className="flex items-center gap-2 border border-accent text-accent hover:bg-accent/10 px-4 py-2 rounded-lg transition-colors cursor-pointer group"
        >
          <BookOpen size={18} />
          <span>Open Player's Guide</span>
          <ArrowRight
            size={16}
            className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all"
          />
        </button>
      </div>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Time / Phase Card */}
        <div
          className={`p-4 rounded-xl border ${phase.borderColor} ${phase.bgColor} flex flex-col justify-between`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg bg-bg-main/50 ${phase.color}`}>
              <Clock size={20} />
            </div>
            <h3 className={`font-bold ${phase.color}`}>{phase.name}</h3>
          </div>
          <p className="text-sm text-text-secondary">{phase.description}</p>
          <div className="mt-4 text-xs font-mono text-text-muted">
            Full day ends in:{" "}
            {Math.max(0, Math.floor((DAY_DURATION_MS - dayTime) / 1000))}s
          </div>
        </div>

        {/* Population Card */}
        <div
          className="relative p-4 rounded-xl border border-border-main bg-bg-panel flex flex-col justify-between hover:border-accent/50 transition-colors group cursor-pointer"
          onClick={() => navigate("/people")}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-bg-main text-blue-400">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-text-main">Population</h3>
            </div>
            <ArrowRight
              size={16}
              className="text-text-muted group-hover:text-accent transition-colors"
            />
          </div>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-2xl font-bold text-text-main">
              {population}
            </span>
            <span className="text-sm text-text-secondary mb-1">citizens</span>
          </div>
          <div className="mt-2 text-xs text-text-muted">
            {unassigned > 0 ? (
              <span className="text-red-500 font-semibold">
                {unassigned} idle
              </span>
            ) : (
              <span className="text-green-500 font-semibold">All active</span>
            )}
          </div>

          {/* Assignments Hover/Pop-up */}
          <div className="absolute top-full left-0 mt-2 w-full p-3 bg-bg-main border border-border-main rounded-xl shadow-xl z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            <h4 className="text-xs font-bold text-text-muted uppercase mb-2">
              Assignments
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
              {Object.entries(assignments).map(
                ([role, count]) =>
                  count > 0 && (
                    <div key={role} className="flex justify-between">
                      <span className="text-text-secondary">{role}:</span>
                      <span className="text-text-main font-mono">{count}</span>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>

        {/* Activities Card */}
        <div
          className="p-4 rounded-xl border border-border-main bg-bg-panel flex flex-col justify-between hover:border-accent/50 transition-colors group cursor-pointer"
          onClick={() => navigate("/activities")}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-bg-main text-purple-400">
                <Activity size={20} />
              </div>
              <h3 className="font-bold text-text-main">Activities</h3>
            </div>
            <ArrowRight
              size={16}
              className="text-text-muted group-hover:text-accent transition-colors"
            />
          </div>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-2xl font-bold text-text-main">
              {activeCount}
            </span>
            <span className="text-sm text-text-secondary mb-1">running</span>
          </div>
          <p className="mt-2 text-xs text-text-muted">
            Manage expeditions & community tasks
          </p>
        </div>

        {/* Military Stats Card */}
        <div
          className="p-4 rounded-xl border border-border-main bg-bg-panel flex flex-col justify-between hover:border-accent/50 transition-colors group cursor-pointer"
          onClick={() => navigate("/military")}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-bg-main text-red-400">
                <Shield size={20} />
              </div>
              <h3 className="font-bold text-text-main">Military</h3>
            </div>
            <ArrowRight
              size={16}
              className="text-text-muted group-hover:text-accent transition-colors"
            />
          </div>
          <div className="flex items-end gap-4 mt-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-xs text-text-muted uppercase">
                <Swords size={12} /> Atk
              </div>
              <span className="text-xl font-bold text-text-main">
                {attackValue}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-xs text-text-muted uppercase">
                <Shield size={12} /> Def
              </div>
              <span className="text-xl font-bold text-text-main">
                {defenseValue}
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs text-text-muted">
            {totalAssigned > 0 && assignments["Warrior"]
              ? `${assignments["Warrior"]} warriors assigned`
              : "No warriors assigned"}
          </p>
        </div>
      </div>

      {/* Daily Loop Guide */}
      <div className="bg-bg-panel border border-border-main rounded-xl p-6">
        <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
          <Map size={20} className="text-accent" />
          Daily Plan
        </h2>
        <div className="grid gap-4">
          <Link
            to="/people"
            className="flex items-start gap-4 p-4 rounded-lg bg-bg-main border border-border-main hover:border-accent/50 hover:bg-bg-main/80 transition-all group"
          >
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-text-main group-hover:text-accent transition-colors">
                1. Manage Population
              </h4>
              <p className="text-sm text-text-secondary mt-1">
                Assign jobs to your citizens based on your current resource
                needs. Ensure you have enough farmers for food.
              </p>
            </div>
          </Link>

          <Link
            to="/activities"
            className="flex items-start gap-4 p-4 rounded-lg bg-bg-main border border-border-main hover:border-accent/50 hover:bg-bg-main/80 transition-all group"
          >
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg group-hover:scale-110 transition-transform">
              <Activity size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-text-main group-hover:text-accent transition-colors">
                2. Start Activities
              </h4>
              <p className="text-sm text-text-secondary mt-1">
                Send spare population on expeditions for rare loot or run
                community tasks for quick bonuses before the sun sets.
              </p>
            </div>
          </Link>

          <Link
            to="/buildings"
            className="flex items-start gap-4 p-4 rounded-lg bg-bg-main border border-border-main hover:border-accent/50 hover:bg-bg-main/80 transition-all group"
          >
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg group-hover:scale-110 transition-transform">
              <Hammer size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-text-main group-hover:text-accent transition-colors">
                3. Construct & Upgrade
              </h4>
              <p className="text-sm text-text-secondary mt-1">
                Use collected resources to upgrade buildings. Prioritize your
                Town Keep to unlock new technology.
              </p>
            </div>
          </Link>

          <Link
            to="/military"
            className="flex items-start gap-4 p-4 rounded-lg bg-bg-main border border-border-main hover:border-accent/50 hover:bg-bg-main/80 transition-all group"
          >
            <div className="p-3 bg-red-500/10 text-red-400 rounded-lg group-hover:scale-110 transition-transform">
              <Shield size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-text-main group-hover:text-accent transition-colors">
                4. Prepare Defenses
              </h4>
              <p className="text-sm text-text-secondary mt-1">
                As night approaches, ensure you have warriors assigned and
                defenses researched to survive the night raids.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Overview;
