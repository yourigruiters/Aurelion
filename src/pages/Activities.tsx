import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { completeActivity } from "../store/activitiesSlice";
import { updateResource } from "../store/resourcesSlice";
import ActivityCard from "../components/ui/ActivityCard";
import { ShieldCheck, Skull } from "lucide-react";
import { Resources } from "../types";

const Activities: React.FC = () => {
  const dispatch = useDispatch();
  const { dailyActivities, lastGenerationDay } = useSelector(
    (state: RootState) => state.activities
  );
  const { assignments } = useSelector((state: RootState) => state.resources);

  // Calculate User Power from Warriors
  // 1 Warrior = 10 Power? Simplified logic.
  const warriorCount = assignments["warrior"] || 0;
  const userPower = warriorCount * 10;

  const handlePerformActivity = (id: string, type: "safe" | "risky") => {
    const activity = dailyActivities.find((a) => a.id === id);
    if (!activity || activity.isCompleted) return;

    let success = true;

    if (type === "risky") {
      // Combat Logic
      // Win Chance = UserPower / EnemyPower
      const enemyPower = activity.enemyPower || 1;

      let chance = 0;
      if (userPower >= enemyPower) chance = 0.95;
      else chance = userPower / enemyPower;

      // Roll
      if (Math.random() > chance) {
        success = false;
      }
    }

    // Dispatch Completion
    dispatch(completeActivity({ id, success }));

    // Handle Rewards / Losses
    if (success) {
      // Add rewards
      Object.entries(activity.baseReward).forEach(([res, amount]) => {
        dispatch(updateResource({ resource: res as keyof Resources, amount }));
      });
      // Risky bonus?
      if (type === "risky") {
        // Maybe extra XP or renown later
      }
    } else {
      // Failure penalty?
      // For now just no rewards.
      // Could injure warriors here.
    }
  };

  const safeActivities = dailyActivities.filter((a) => a.type === "safe");
  const riskyActivities = dailyActivities.filter((a) => a.type === "risky");

  return (
    <div className="h-full w-full p-6 flex flex-col overflow-hidden bg-bg-main">
      <div className="flex-1 flex flex-col rounded-xl overflow-hidden shadow-xl border border-border-main bg-bg-panel">
        {/* Top Header */}
        <div className="flex-none p-8 pb-4">
          <h1 className="text-3xl font-bold text-text-main">
            Daily Activities
          </h1>
          <p className="text-text-secondary">
            Day {lastGenerationDay} - Choose your undertakings carefully.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-2 space-y-8">
          {/* Safe Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-success" size={24} />
              <h2 className="text-xl font-bold text-text-main">
                Community Tasks
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {safeActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onPerform={handlePerformActivity}
                />
              ))}
              {safeActivities.length === 0 && (
                <p className="text-text-muted italic">
                  No community tasks available.
                </p>
              )}
            </div>
          </section>

          {/* Risky Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Skull className="text-danger" size={24} />
              <h2 className="text-xl font-bold text-text-main">Expeditions</h2>
            </div>
            {userPower === 0 && (
              <div className="mb-4 p-3 bg-danger/10 text-danger border border-danger/20 rounded text-sm">
                WARNING: You have no active Warriors. Expeditions are highly
                dangerous!
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {riskyActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onPerform={handlePerformActivity}
                  userPower={userPower}
                />
              ))}
              {riskyActivities.length === 0 && (
                <p className="text-text-muted italic">
                  No expeditions reported.
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
