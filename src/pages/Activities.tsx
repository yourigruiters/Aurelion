import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { startActivity } from "../store/activitiesSlice";
import { setRightSidebarOpen } from "../store/gameSlice";
import ActivityCard from "../components/ui/ActivityCard";
import { ShieldCheck, Skull } from "lucide-react";

import { SEGMENT_DURATION_MS } from "../helpers/game";

const Activities: React.FC = () => {
  const dispatch = useDispatch();
  const { dailyActivities, activeSafeActivity, activeRiskyActivity } =
    useSelector((state: RootState) => state.activities);
  const { assignments } = useSelector((state: RootState) => state.resources);
  const { dayTime } = useSelector((state: RootState) => state.game);
  const { totalAttackBonus } = useSelector(
    (state: RootState) => state.military
  );

  // Activities expire after the yellow zone (2/3 of day)
  const expireThreshold = SEGMENT_DURATION_MS * 2;
  const expired = dayTime >= expireThreshold;

  // Calculate User Power from Warriors + Military Tech
  const warriorCount = assignments["Warrior"] || 0;
  // Base attack is 1 per warrior, plus bonuses per warrior
  const userPower = Math.floor(warriorCount * (1 + (totalAttackBonus || 0)));

  const handlePerformActivity = (id: string, type: "safe" | "risky") => {
    // Dispatch Start
    dispatch(startActivity({ id }));
    dispatch(setRightSidebarOpen(true)); // Open sidebar
  };

  const safeActivities = dailyActivities.filter((a) => a.type === "safe");
  const riskyActivities = dailyActivities.filter((a) => a.type === "risky");

  const displaySafeActivities = activeSafeActivity
    ? [activeSafeActivity]
    : safeActivities;

  const displayRiskyActivities = activeRiskyActivity
    ? [activeRiskyActivity]
    : riskyActivities;

  return (
    <div className="h-full w-full p-6 flex flex-col overflow-hidden bg-bg-main">
      <div className="flex-1 flex flex-col rounded-xl overflow-hidden shadow-xl border border-border-main bg-bg-panel">
        {/* Top Header */}
        <div className="flex-none p-8 pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-text-main">
              Daily activities
            </h1>
          </div>

          {/* Global Timer */}
          <div
            className={`
             flex items-center gap-2 px-3 py-1 rounded border font-mono font-bold text-xs
             ${
               expired
                 ? "bg-danger/10 border-danger text-danger"
                 : "bg-bg-main border-accent text-accent"
             }
          `}
          >
            {expired ? (
              <span className="uppercase">Activities locked</span>
            ) : (
              <>
                <span className="text-text-muted mr-1">Time Left:</span>
                <span>
                  {Math.floor((expireThreshold - dayTime) / 60000)}:
                  {Math.floor(((expireThreshold - dayTime) % 60000) / 1000)
                    .toString()
                    .padStart(2, "0")}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-2 space-y-8">
          {/* Safe Section */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-success" size={24} />
              <h2 className="text-xl font-bold text-text-main">Daily tasks</h2>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Simple tasks to help the settlement. Only 1 task can be selected
              per day.
            </p>

            <div className="flex flex-col gap-4">
              {displaySafeActivities.map((activity) => {
                const isActive = activeSafeActivity?.id === activity.id;

                return (
                  <div
                    key={activity.id}
                    className="transition-opacity duration-300 opacity-100"
                  >
                    <ActivityCard
                      activity={activity}
                      onPerform={handlePerformActivity}
                      disabled={expired || !!activeSafeActivity}
                      isSelected={isActive}
                    />
                  </div>
                );
              })}
              {safeActivities.length === 0 && (
                <p className="text-text-muted italic">
                  No daily tasks available.
                </p>
              )}
            </div>
          </section>

          {/* Risky Section */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Skull className="text-danger" size={24} />
              <h2 className="text-xl font-bold text-text-main">Expeditions</h2>
            </div>
            <div className="mb-4 space-y-1">
              <p className="text-sm text-text-secondary">
                High risk, high reward missions. Only 1 Raid can be selected at
                a time.
              </p>
              <p className="text-sm text-text-secondary">
                <span className="text-danger font-bold">Warning:</span> Warriors
                can potentially die in combat.
              </p>
            </div>

            {warriorCount === 0 && (
              <div className="mb-4 p-3 bg-danger/10 text-danger border border-danger/20 rounded text-sm font-bold flex items-center gap-2">
                <Skull size={16} />
                You must assign at least 1 Warrior to start an Expedition.
              </div>
            )}

            <div className="flex flex-col gap-4">
              {displayRiskyActivities.map((activity) => {
                const isActive = activeRiskyActivity?.id === activity.id;
                const canStart = warriorCount > 0;

                return (
                  <div
                    key={activity.id}
                    className="transition-opacity duration-300 opacity-100"
                  >
                    <ActivityCard
                      activity={activity}
                      onPerform={(id, type) => {
                        if (type === "risky" && warriorCount === 0) return;
                        handlePerformActivity(id, type);
                      }}
                      userPower={userPower}
                      disabled={
                        expired ||
                        !!activeRiskyActivity ||
                        (!isActive && !canStart)
                      }
                      isSelected={isActive}
                    />
                  </div>
                );
              })}
              {riskyActivities.length === 0 && (
                <p className="text-text-muted italic">
                  Your warriors are still on their way.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Activities;
