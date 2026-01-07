import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAssignments } from "../store/resourcesSlice";
import { RootState } from "../store/store";
import {
  Wheat,
  Fish,
  Axe,
  Pickaxe,
  Hammer,
  Coins,
  Swords,
  Lock,
  Minus,
  Plus,
  Save,
  Apple,
  Mountain,
  Gem,
  LucideIcon,
  CheckCircle,
} from "lucide-react";
import Button from "../components/ui/Button";

import { SEGMENT_DURATION_MS } from "../helpers/game";
import { BUILDING_DEFINITIONS, BuildingId } from "../store/buildingsSlice"; // Import BuildingId

interface Impact {
  resource: string; // keyof Resources but flexible for now
  val: number;
  icon: LucideIcon;
}

interface RoleDefinition {
  id: string; // Role type
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  locked?: boolean; // Deprecated in favor of requiredBuilding, but kept for simple locks
  requiredBuilding?: BuildingId; // Properly typed using BuildingId
  impacts: Impact[];
}

// Role Logic Definitions
const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: "Farmer",
    name: "Farmer",
    description: "Cultivates crops for food.",
    icon: Wheat,
    color: "text-succes",
    impacts: [{ resource: "food", val: 12, icon: Apple }],
  },
  {
    id: "Fisher",
    name: "Fisher",
    description: "Catches fish from local waters.",
    icon: Fish,
    color: "text-blue-400",
    impacts: [{ resource: "food", val: 8, icon: Apple }],
  },
  {
    id: "Woodcutter",
    name: "Woodcutter",
    description: "Chops trees for timber.",
    icon: Axe,
    color: "text-brand",
    impacts: [{ resource: "wood", val: 10, icon: Wheat }],
  },
  {
    id: "Miner",
    name: "Miner",
    description: "Digs deep for stone and iron.",
    icon: Pickaxe,
    color: "text-text-secondary",
    impacts: [
      { resource: "stone", val: 5, icon: Mountain },
      { resource: "iron", val: 1, icon: Hammer },
    ],
  },
  {
    id: "Deep Miner",
    name: "Deep Miner",
    description: "Extracts deep earth minerals.",
    icon: Pickaxe,
    color: "text-indigo-400",
    requiredBuilding: "deep_mine", // Requires Deep Mine
    impacts: [
      { resource: "stone", val: 8, icon: Mountain },
      { resource: "iron", val: 3, icon: Hammer },
    ],
  },

  {
    id: "Warrior",
    name: "Warrior",
    description: "Defends the colony.",
    icon: Swords,
    color: "text-danger",
    impacts: [],
  },
  {
    id: "Merchant",
    name: "Merchant",
    description: "Trades goods for profit.",
    icon: Coins,
    color: "text-accent",
    requiredBuilding: "trade_post", // Requires Trade Post
    impacts: [{ resource: "gold", val: 5, icon: Gem }],
  },
];

const People: React.FC = () => {
  const dispatch = useDispatch();
  const {
    population,
    assignments = {},
    rates: currentRates,
  } = useSelector((state: RootState) => state.resources);
  const { dayTime } = useSelector((state: RootState) => state.game);
  const { buildings } = useSelector((state: RootState) => state.buildings); // Add buildings selector

  // Expire after 1st segment (20s)
  const expireThreshold = SEGMENT_DURATION_MS;
  const expired = dayTime >= expireThreshold;

  // Local state for editing assignments
  const [localAssignments, setLocalAssignments] =
    useState<Record<string, number>>(assignments);
  const [idlePop, setIdlePop] = useState(0);

  // Sync local state when redux state changes (e.g. init)
  useEffect(() => {
    setLocalAssignments(assignments);
  }, [assignments]);

  // Calculate Idle Population based on local assignments
  useEffect(() => {
    const totalAssigned = Object.values(localAssignments).reduce(
      (a, b) => a + b,
      0
    );
    setIdlePop(population - totalAssigned);
  }, [localAssignments, population]);

  const handleAdjust = (roleId: string, delta: number) => {
    const current = localAssignments[roleId] || 0;
    const newCount = current + delta;

    // Validation
    if (newCount < 0) return;
    if (delta > 0 && idlePop <= 0) return;

    setLocalAssignments((prev) => ({
      ...prev,
      [roleId]: newCount,
    }));
  };

  // Calculate PROJECTED TOTAL Daily Income
  const calculateProjectedRates = () => {
    // Step 1: Calculate Delta based on local vs saved assignments
    let diffs: Record<string, number> = {
      food: 0,
      wood: 0,
      stone: 0,
      iron: 0,
      gold: 0,
    };

    ROLE_DEFINITIONS.forEach((role) => {
      if (!role.locked && role.impacts.length > 0) {
        const currentCount = assignments[role.id] || 0;
        const newCount = localAssignments[role.id] || 0;
        const delta = newCount - currentCount;
        if (delta !== 0) {
          role.impacts.forEach((imp) => {
            diffs[imp.resource] += delta * imp.val;
          });
        }
      }
    });

    // Step 2: Add Delta to Current Rates
    // We need to clone currentRates or create a new object
    // currentRates is Rates type which has population too.
    let projected: Record<string, number> = { ...currentRates };

    Object.keys(diffs).forEach((key) => {
      projected[key] = (projected[key] || 0) + diffs[key];
    });

    return projected;
  };

  const projectedRates = calculateProjectedRates();

  const [saved, setSaved] = useState(false);

  const onSave = () => {
    dispatch(setAssignments(localAssignments));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="h-full w-full p-6 flex flex-col overflow-hidden bg-bg-main">
      <div className="flex-1 flex flex-col rounded-xl overflow-hidden shadow-xl border border-border-main bg-bg-panel">
        {/* Top Bar: 3 Sections */}
        <div className="flex-none h-24 border-b border-border-main bg-bg-panel flex items-center">
          {/* Section 1: Idle Villagers (Left) */}
          <div className="w-auto flex-none h-full flex flex-col items-center justify-center border-r border-border-main p-4 xl:w-64">
            <span className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">
              Idle Villagers
            </span>
            <span
              className={`text-3xl font-bold ${
                idlePop < 0
                  ? "text-danger"
                  : idlePop > 0
                  ? "text-warning"
                  : "text-text-muted"
              }`}
            >
              {idlePop}
            </span>
          </div>

          {/* Section 2: Daily Income (Middle) */}
          <div className="flex-1 h-full flex flex-col items-center justify-center border-r border-border-main p-4">
            <span className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-3">
              Daily Income
            </span>
            <div
              className="flex items-center gap-8"
              title="Expected daily income for the next day"
            >
              {/* Gold */}
              <div className="flex items-center gap-2">
                <Gem size={20} className="text-accent" />
                <span className="font-bold text-lg text-text-main">
                  {Math.floor(projectedRates.gold || 0)}
                </span>
              </div>
              {/* Food */}
              <div className="flex items-center gap-2">
                <Apple size={20} className="text-danger-light" />
                <span className="font-bold text-lg text-text-main">
                  {Math.floor(projectedRates.food || 0)}
                </span>
              </div>
              {/* Wood */}
              <div className="flex items-center gap-2">
                <Wheat size={20} className="text-brand" />
                <span className="font-bold text-lg text-text-main">
                  {Math.floor(projectedRates.wood || 0)}
                </span>
              </div>
              {/* Stone */}
              <div className="flex items-center gap-2">
                <Mountain size={20} className="text-text-muted" />
                <span className="font-bold text-lg text-text-main">
                  {Math.floor(projectedRates.stone || 0)}
                </span>
              </div>
              {/* Iron */}
              <div className="flex items-center gap-2">
                <Hammer size={20} className="text-text-secondary" />
                <span className="font-bold text-lg text-text-main">
                  {Math.floor(projectedRates.iron || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Timer & Save (Right) */}
          <div className="w-auto flex-none h-full flex flex-col items-center justify-center p-4 xl:w-64 gap-2">
            {/* Timer Removed */}

            <Button
              onClick={onSave}
              // @ts-ignore
              variant={saved ? "success" : "primary"}
              icon={saved ? CheckCircle : Save}
              disabled={idlePop < 0 || expired || saved}
            >
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Role List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-text-main">
              Population Management
            </h1>
            {/* Timer moved here */}
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
                <span className="uppercase">Assignments Locked</span>
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

          <div className="grid grid-cols-1 gap-4">
            {ROLE_DEFINITIONS.map((role) => {
              const count = localAssignments[role.id] || 0;

              // Dynamic Lock Logic
              let isLocked = role.locked || false;
              let lockReason = "Locked";

              if (role.requiredBuilding) {
                // @ts-ignore
                const building = buildings[role.requiredBuilding];
                if (!building || !building.unlocked) {
                  isLocked = true;
                  // @ts-ignore
                  const buildingName =
                    BUILDING_DEFINITIONS[role.requiredBuilding]?.name ||
                    "Building";
                  lockReason = `Requires ${buildingName}`;
                }
              }

              const Icon = role.icon;

              return (
                <div
                  key={role.id}
                  className={`flex items-center h-24 rounded-lg border ${
                    isLocked
                      ? "bg-bg-main border-border-main opacity-60"
                      : "bg-bg-panel border-border-light hover:border-border-active"
                  }`}
                >
                  {/* Section 1: Icon & Summary (Left) */}
                  <div className="w-1/3 h-full flex items-center p-4 border-r border-border-main/50">
                    <div
                      className={`p-3 rounded-full mr-4 bg-bg-main ${
                        isLocked ? "text-text-muted" : role.color
                      }`}
                    >
                      {isLocked ? <Lock size={24} /> : <Icon size={24} />}
                    </div>
                    <div className="overflow-hidden flex flex-col justify-center">
                      <h3 className="text-lg font-bold text-text-main truncate leading-tight">
                        {role.name}
                      </h3>
                      <p className="text-sm text-text-secondary truncate leading-tight">
                        {role.description}
                      </p>
                      {isLocked && (
                        <p className="text-xs text-danger font-bold mt-0.5">
                          {lockReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Section 2: Impact (Middle) */}
                  <div className="flex-1 h-full flex items-center justify-center gap-6 border-r border-border-main/50 bg-bg-main/20">
                    {role.impacts.length > 0 ? (
                      role.impacts.map((imp, idx) => {
                        let colorClass = "text-text-main";
                        switch (imp.resource) {
                          case "food":
                            colorClass = "text-danger-light";
                            break;
                          case "wood":
                            colorClass = "text-brand";
                            break;
                          case "stone":
                            colorClass = "text-text-muted";
                            break;
                          case "iron":
                            colorClass = "text-text-secondary";
                            break;
                          case "gold":
                            colorClass = "text-accent";
                            break;
                        }

                        return (
                          <div key={idx} className="flex items-center gap-2">
                            <imp.icon size={18} className={colorClass} />
                            <span className="font-mono font-semibold text-text-main">
                              +{imp.val}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-text-dim text-sm italic">
                        No resource output
                      </span>
                    )}
                  </div>

                  {/* Section 3: Controls (Right) */}
                  <div className="w-48 h-full flex items-center justify-center space-x-4 p-4">
                    <button
                      onClick={() => handleAdjust(role.id, -1)}
                      disabled={isLocked || count <= 0 || expired}
                      className="p-2 rounded-full border border-border-main hover:bg-bg-main disabled:hover:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed text-text-secondary transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-2xl font-bold w-12 text-center text-text-main">
                      {count}
                    </span>
                    <button
                      onClick={() => handleAdjust(role.id, 1)}
                      disabled={isLocked || idlePop <= 0 || expired}
                      className="p-2 rounded-full border border-border-main hover:bg-bg-main disabled:hover:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed text-text-secondary transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default People;
