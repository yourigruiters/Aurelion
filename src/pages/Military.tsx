import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  MILITARY_TECHS,
  TechId,
  startResearch,
  TechDefinition,
} from "../store/militarySlice";
import { deductResources } from "../store/resourcesSlice";
import { RESOURCE_ORDER } from "../helpers/resource";
import Button from "../components/ui/Button";
import {
  Swords,
  Shield,
  Target,
  Hammer,
  Castle,
  Lock,
  CheckCircle,
  Loader,
} from "lucide-react";
import ResourceDisplay from "../components/ui/ResourceDisplay";

// Helper for icons
const TechIcon = ({ id, size = 24 }: { id: TechId; size?: number }) => {
  switch (id) {
    case "basic_weaponry":
      return <Swords size={size} className="text-zinc-400" />;
    case "leather_armor":
      return <Shield size={size} className="text-amber-700" />;
    case "warrior_training":
      return <Target size={size} className="text-green-600" />;
    case "iron_forging":
      return <Hammer size={size} className="text-zinc-200" />;
    case "fortifications":
      return <Castle size={size} className="text-zinc-500" />;
    default:
      return null;
  }
};

const Military: React.FC = () => {
  const dispatch = useDispatch();
  const { unlockedTechs, activeResearch, totalAttackBonus, totalDefenseBonus } =
    useSelector((state: RootState) => state.military);
  const { resources, assignments } = useSelector(
    (state: RootState) => state.resources
  );

  // Derived stats
  const warriorCount = Number(assignments["Warrior"] || 0);
  const attackValue = Math.floor(warriorCount * (1 + (totalAttackBonus || 0)));

  const canAfford = (cost: Record<string, number>) => {
    return Object.entries(cost).every(([res, amount]) => {
      // @ts-ignore
      return (resources[res] || 0) >= amount;
    });
  };

  const hasRequirements = (tech: TechDefinition) => {
    if (!tech.requires) return true;
    return tech.requires.every((reqId) => unlockedTechs.includes(reqId));
  };

  const handleResearch = (tech: TechDefinition) => {
    if (canAfford(tech.cost) && !activeResearch) {
      dispatch(deductResources(tech.cost));
      dispatch(startResearch(tech.id));
    }
  };

  const techList = Object.values(MILITARY_TECHS);

  return (
    <div className="h-full w-full p-6 flex flex-col overflow-hidden bg-bg-main text-text-main">
      <div className="flex-1 rounded-xl overflow-y-auto shadow-xl border border-border-main bg-bg-panel p-8 space-y-8">
        {/* Header Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border-main">
          <div>
            <h1 className="text-3xl font-bold text-text-main mb-2">
              Military Research
            </h1>
            <p className="text-text-secondary">
              Invest in new technologies to strengthen your army and defenses.
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center p-4 bg-bg-main rounded-lg border border-border-main min-w-[100px]">
              <div className="text-2xl font-bold text-danger">
                {attackValue}
              </div>
              <div className="text-xs uppercase text-text-muted font-bold tracking-wider">
                Attack power
              </div>
            </div>
            <div className="text-center p-4 bg-bg-main rounded-lg border border-border-main min-w-[100px]">
              <div className="text-2xl font-bold text-blue-500">
                {totalDefenseBonus}
              </div>
              <div className="text-xs uppercase text-text-muted font-bold tracking-wider">
                Defense power
              </div>
            </div>
          </div>
        </div>

        {/* Research List */}
        <div className="flex flex-col gap-4">
          {techList.map((tech) => {
            const isUnlocked = unlockedTechs.includes(tech.id);
            const isLocked = !hasRequirements(tech) && !isUnlocked;
            const affordable = canAfford(tech.cost);
            const isResearching = activeResearch?.techId === tech.id;

            const isDisabled =
              isUnlocked ||
              isLocked ||
              !affordable ||
              (activeResearch !== null && !isResearching);

            return (
              <div
                key={tech.id}
                className={`flex flex-col md:flex-row items-center p-4 rounded-lg border transition-all gap-4 ${
                  isUnlocked
                    ? "bg-bg-main border-success/30 shadow-[0_0_5px_rgba(34,197,94,0.05)]"
                    : isResearching
                    ? "bg-bg-main border-brand shadow-[0_0_5px_rgba(99,102,241,0.15)]"
                    : isLocked
                    ? "bg-bg-main/30 border-border-main opacity-60 grayscale"
                    : "bg-bg-main border-border-main hover:border-brand shadow-sm"
                }`}
              >
                {/* Icon & Name */}
                <div className="flex items-center flex-1 w-full md:w-auto gap-4">
                  <div
                    className={`p-3 rounded-full border flex-none ${
                      isUnlocked
                        ? "bg-success/10 border-success/20"
                        : isResearching
                        ? "bg-brand/10 border-brand/20"
                        : "bg-bg-panel border-border-main"
                    }`}
                  >
                    {isResearching ? (
                      <Loader className="animate-spin text-brand" size={24} />
                    ) : (
                      <TechIcon id={tech.id} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-main">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {tech.description}
                    </p>

                    {/* Stats Inline */}
                    <div className="flex flex-wrap gap-3 mt-1 text-xs font-mono">
                      {tech.effects.attackBonus && (
                        <span className="text-danger flex items-center gap-1">
                          <Swords size={12} /> +{tech.effects.attackBonus}{" "}
                          Attack/Warrior
                        </span>
                      )}
                      {tech.effects.defenseBonus && (
                        <span className="text-blue-400 flex items-center gap-1">
                          <Shield size={12} /> +{tech.effects.defenseBonus}{" "}
                          Defense
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-text-muted mt-1 flex items-center gap-1">
                      Time: {tech.researchTimeDays}{" "}
                      {tech.researchTimeDays === 1 ? "day" : "days"}
                      <span className="mx-2">•</span>
                      <span className="text-brand flex items-center gap-1">
                        +{tech.experience} XP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Status or Action */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                  {isUnlocked ? (
                    <div className="px-4 py-2 bg-success/10 text-success text-sm font-bold rounded flex items-center gap-2 border border-success/20">
                      <CheckCircle size={16} /> Researched
                    </div>
                  ) : isResearching ? (
                    <div className="px-4 py-2 bg-brand/10 text-brand text-sm font-bold rounded flex items-center gap-2 border border-brand/20">
                      <Loader size={16} className="animate-spin" />{" "}
                      {activeResearch?.remainingDays}d left
                    </div>
                  ) : isLocked ? (
                    <div className="px-4 py-2 bg-danger/5 text-danger text-xs font-bold rounded flex items-center gap-2 border border-danger/10">
                      <Lock size={16} /> Needs:{" "}
                      {tech.requires
                        ?.map((id) => MILITARY_TECHS[id].name)
                        .join(", ")}
                    </div>
                  ) : (
                    <>
                      {/* Costs */}
                      <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
                        {Object.entries(tech.cost)
                          .sort(
                            (a, b) =>
                              RESOURCE_ORDER.indexOf(a[0]) -
                              RESOURCE_ORDER.indexOf(b[0])
                          )
                          .map(([res, amt]) => (
                            <div
                              key={res}
                              className={`flex items-center gap-1.5 px-2 py-1 rounded bg-bg-panel border border-border-main text-xs ${
                                (resources[res as keyof typeof resources] ||
                                  0) < amt
                                  ? "text-danger border-danger/30"
                                  : "text-text-main"
                              }`}
                            >
                              <ResourceDisplay
                                resource={res}
                                amount={amt}
                                size="sm"
                                className="text-inherit"
                                iconClassName="text-current"
                              />
                            </div>
                          ))}
                      </div>
                      <Button
                        onClick={() => handleResearch(tech)}
                        disabled={isDisabled}
                        variant="primary"
                        className="min-w-[100px]"
                      >
                        Research
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Military;
