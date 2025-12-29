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

        {/* Research Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {techList.map((tech) => {
            const isUnlocked = unlockedTechs.includes(tech.id);
            const isLocked = !hasRequirements(tech) && !isUnlocked;
            const affordable = canAfford(tech.cost);

            return (
              <div
                key={tech.id}
                className={`relative p-5 rounded-lg border transition-all flex flex-col gap-4 ${
                  isUnlocked
                    ? "bg-bg-main/50 border-success/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                    : isLocked
                    ? "bg-bg-main/30 border-border-main opacity-60 grayscale"
                    : "bg-bg-main border-border-main hover:border-brand shadow-sm"
                }`}
              >
                {/* Status Icon Overlay */}
                <div className="absolute top-4 right-4">
                  {isUnlocked ? (
                    <CheckCircle size={20} className="text-success" />
                  ) : isLocked ? (
                    <Lock size={20} className="text-text-muted" />
                  ) : null}
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-full border ${
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
                    <div className="text-xs font-mono mt-0.5 flex gap-2">
                      {tech.effects.power && (
                        <span className="text-danger">
                          +{tech.effects.power} Power
                        </span>
                      )}
                      {tech.effects.defense && (
                        <span className="text-blue-400">
                          +{tech.effects.defense} Defense
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-text-secondary h-10 line-clamp-2">
                  {tech.description}
                </p>

                {!isUnlocked && !isLocked && (
                  <div className="mt-auto pt-4 border-t border-border-main/50 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
                      {Object.entries(tech.cost).map(([res, amt]) => (
                        <div
                          key={res}
                          className={`flex items-center justify-between px-2 py-1 rounded bg-bg-panel ${
                            (resources[res as keyof typeof resources] || 0) <
                            amt
                              ? "text-danger"
                              : ""
                          }`}
                        >
                          <span className="capitalize">{res}</span>
                          <span className="font-mono">{amt}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleUnlock(tech)}
                      disabled={!affordable}
                      variant="primary"
                      className="w-full text-sm py-1"
                    >
                      Research
                    </Button>
                  </div>
                )}

                {isLocked && (
                  <div className="mt-auto pt-4 border-t border-border-main/50">
                    <div className="text-xs text-danger flex items-center gap-1 justify-center py-2 bg-danger/5 rounded border border-danger/10">
                      <Lock size={12} /> Requires:{" "}
                      {tech.requires
                        ?.map((id) => MILITARY_TECHS[id].name)
                        .join(", ")}
                    </div>
                  </div>
                )}

                {isUnlocked && (
                  <div className="mt-auto pt-4 border-t border-border-main/50">
                    <div className="text-xs text-success flex items-center gap-1 justify-center py-2 bg-success/5 rounded border border-success/10">
                      <CheckCircle size={12} /> Researched
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Military;
