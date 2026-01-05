import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  MILITARY_TECHS,
  TechId,
  unlockTech,
  TechDefinition,
} from "../store/militarySlice";
import { deductResources } from "../store/resourcesSlice";
import Button from "../components/ui/Button";
import {
  Swords,
  Shield,
  Target,
  Hammer,
  Castle,
  Lock,
  CheckCircle,
} from "lucide-react";

// Helper for icons
const TechIcon = ({ id, size = 24 }: { id: TechId; size?: number }) => {
  switch (id) {
    case "basic_weaponry":
      return <Swords size={size} className="text-zinc-400" />;
    case "leather_armor":
      return <Shield size={size} className="text-amber-700" />;
    case "archery":
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
  const { unlockedTechs, militaryPower, defense } = useSelector(
    (state: RootState) => state.military
  );
  const { resources } = useSelector((state: RootState) => state.resources);

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

  const handleUnlock = (tech: TechDefinition) => {
    if (canAfford(tech.cost)) {
      dispatch(deductResources(tech.cost));
      dispatch(unlockTech(tech.id));
    }
  };

  // Group techs by "Tier" roughly inferred by dependencies for display
  // Tier 1: No reqs
  // Tier 2: Reqs
  // Ideally we map this out better, but a simple list or grid works for now.
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
                {militaryPower}
              </div>
              <div className="text-xs uppercase text-text-muted font-bold tracking-wider">
                Attack power
              </div>
            </div>
            <div className="text-center p-4 bg-bg-main rounded-lg border border-border-main min-w-[100px]">
              <div className="text-2xl font-bold text-blue-500">{defense}</div>
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

            return (
              <div
                key={tech.id}
                className={`flex flex-col md:flex-row items-center p-4 rounded-lg border transition-all gap-4 ${
                  isUnlocked
                    ? "bg-bg-main border-success/30 shadow-[0_0_5px_rgba(34,197,94,0.05)]"
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
                        : "bg-bg-panel border-border-main"
                    }`}
                  >
                    <TechIcon id={tech.id} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-text-main">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {tech.description}
                    </p>

                    {/* Stats Inline */}
                    <div className="flex gap-3 mt-1 text-xs font-mono">
                      {tech.effects.power && (
                        <span className="text-danger flex items-center gap-1">
                          <Swords size={12} /> +{tech.effects.power} Power
                        </span>
                      )}
                      {tech.effects.defense && (
                        <span className="text-blue-400 flex items-center gap-1">
                          <Shield size={12} /> +{tech.effects.defense} Defense
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Status or Action */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                  {isUnlocked ? (
                    <div className="px-4 py-2 bg-success/10 text-success text-sm font-bold rounded flex items-center gap-2 border border-success/20">
                      <CheckCircle size={16} /> Researched
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
                        {Object.entries(tech.cost).map(([res, amt]) => (
                          <div
                            key={res}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded bg-bg-panel border border-border-main text-xs ${
                              (resources[res as keyof typeof resources] || 0) <
                              amt
                                ? "text-danger border-danger/30"
                                : "text-text-main"
                            }`}
                          >
                            <span className="capitalize">{res}</span>
                            <span className="font-bold">{amt}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => handleUnlock(tech)}
                        disabled={!affordable}
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
