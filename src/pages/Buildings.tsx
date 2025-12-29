import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  BUILDING_DEFINITIONS,
  BuildingId,
  upgradeBuilding,
  constructHouse,
  upgradeHouse,
  unlockBuilding,
  HouseType,
} from "../store/buildingsSlice";
import { deductResources } from "../store/resourcesSlice";
import Button from "../components/ui/Button";
import {
  Home,
  Users,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowUpCircle,
  Construction,
  Coins,
  Wheat,
  Mountain,
  Pickaxe,
  Lock,
} from "lucide-react";

// Helper components for icons
const ResourceIcon = ({
  resource,
  size = 16,
}: {
  resource: string;
  size?: number;
}) => {
  switch (resource) {
    case "food":
      return <Wheat size={size} className="text-danger-light" />;
    case "wood":
      return <Wheat size={size} className="text-brand rotate-90" />; // Fallback icon if Axe not avail
    case "stone":
      return <Mountain size={size} className="text-text-muted" />;
    case "iron":
      return <Pickaxe size={size} className="text-text-secondary" />;
    case "gold":
      return <Coins size={size} className="text-accent" />;
    default:
      return null;
  }
};

const Buildings: React.FC = () => {
  const dispatch = useDispatch();
  const { buildings, housing } = useSelector(
    (state: RootState) => state.buildings
  );
  const { resources } = useSelector((state: RootState) => state.resources);

  // Expanded state for building rows
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Helper Functions ---

  const canAfford = (cost: Record<string, number>) => {
    return Object.entries(cost).every(([res, amount]) => {
      // @ts-ignore
      return (resources[res] || 0) >= amount;
    });
  };

  const getUpgradeCost = (id: BuildingId, currentLevel: number) => {
    const def = BUILDING_DEFINITIONS[id];
    const scaling = def.costScaling;
    const base = def.baseCost;

    // Formula: Base * (Scaling ^ (Level - 1))? Or Level?
    // Let's use Level. So Level 1 -> 2 costs Base * Scaling^1
    const multiplier = Math.pow(scaling, currentLevel);

    const cost: Record<string, number> = {};
    Object.entries(base).forEach(([res, amount]) => {
      cost[res] = Math.floor(amount * multiplier);
    });
    return cost;
  };

  const handleUpgradeBuilding = (id: BuildingId) => {
    const building = buildings[id];
    if (!building) return;
    const cost = getUpgradeCost(id, building.level);

    if (canAfford(cost)) {
      dispatch(deductResources(cost));
      dispatch(upgradeBuilding(id));
      // If unlocking was separate, we'd handle it, but here unlocking logic can be part of upgrade/unlock button
    }
  };

  const handleUnlockBuilding = (id: BuildingId) => {
    // Determine Unlock Cost - maybe same as base cost?
    // Let's assume unlocking costs the baseCost of the building
    const def = BUILDING_DEFINITIONS[id];
    const cost = def.baseCost;

    if (canAfford(cost)) {
      dispatch(deductResources(cost));
      dispatch(unlockBuilding(id));
    }
  };

  const handleConstructHouse = (plotId: number, type: HouseType) => {
    // Define Costs
    // Cottage: 50 Wood
    // Homestead: 100 Wood, 50 Stone (Upgrade from Cottage)
    // Direct Homestead: 150 Wood, 50 Stone (Combined cost)

    let cost: Record<string, number> = {};
    if (type === "cottage") {
      cost = { wood: 50 };
    } else if (type === "homestead") {
      // Check if upgrading or new
      const current = housing[plotId].type;
      if (current === "cottage") {
        cost = { wood: 100, stone: 50 };
      } else {
        // Direct build
        cost = { wood: 150, stone: 50 };
      }
    }

    if (canAfford(cost)) {
      dispatch(deductResources(cost));
      if (type === "cottage") {
        dispatch(constructHouse({ plotId, type }));
      } else if (type === "homestead") {
        if (housing[plotId].type === "cottage") {
          dispatch(upgradeHouse(plotId));
        } else {
          // Direct build need to simulate build cottage then upgrade?
          // Or just set type. existing reducer `constructHouse` sets type/cap.
          dispatch(constructHouse({ plotId, type }));
        }
      }
    }
  };

  return (
    <div className="h-full w-full p-6 flex flex-col overflow-hidden bg-bg-main text-text-main">
      <div className="flex-1 flex flex-col rounded-xl overflow-y-auto shadow-xl border border-border-main bg-bg-panel p-8 space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-main mb-2">
            City Buildings
          </h1>
          <p className="text-text-secondary">
            Manage your settlement's infrastructure and housing.
          </p>
        </div>

        {/* --- HOUSING SECTION --- */}
        <section>
          <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
            <Home size={24} className="text-brand" />
            Residential Plots
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-4">
            {Object.entries(housing).map(([key, plot]) => {
              const plotId = parseInt(key);
              const isCottage = plot.type === "cottage";
              const isHomestead = plot.type === "homestead";
              const isEmpty = plot.type === "none";

              return (
                <div
                  key={plotId}
                  className="bg-bg-main border border-border-main rounded-lg p-4 flex flex-col gap-3 hover:border-border-active transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted uppercase font-bold">
                      Plot {plotId}
                    </span>
                    {isHomestead && (
                      <span className="text-xs text-accent">Max Level</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-full ${
                        isEmpty
                          ? "bg-bg-panel text-text-muted"
                          : "bg-brand/20 text-brand"
                      }`}
                    >
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        {isEmpty
                          ? "Vacant Lot"
                          : isCottage
                          ? "Small Cottage"
                          : "Homestead"}
                      </h3>
                      <p className="text-xs text-text-secondary">
                        {isEmpty
                          ? "Ready for construction"
                          : `Houses ${plot.populationCap} people`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-2 border-t border-border-main/50 space-y-2">
                    {isEmpty && (
                      <>
                        <Button
                          className="w-full text-xs flex items-center justify-center gap-1"
                          variant="outline"
                          onClick={() =>
                            handleConstructHouse(plotId, "cottage")
                          }
                          disabled={!canAfford({ wood: 50 })}
                        >
                          Build Cottage (50{" "}
                          <ResourceIcon resource="wood" size={12} />)
                        </Button>
                        <Button
                          className="w-full text-xs flex items-center justify-center gap-1"
                          variant="outline"
                          onClick={() =>
                            handleConstructHouse(plotId, "homestead")
                          }
                          disabled={!canAfford({ wood: 150, stone: 50 })}
                        >
                          Build Homestead (150{" "}
                          <ResourceIcon resource="wood" size={12} />, 50{" "}
                          <ResourceIcon resource="stone" size={12} />)
                        </Button>
                      </>
                    )}
                    {isCottage && (
                      <Button
                        className="w-full text-xs flex items-center justify-center gap-1"
                        variant="primary" // Keeping primary for upgrade urgency/importance? Or outline? User said "For the other plots, also just directly place the buttons...". User said "The orange buttons... are kind of IN YOUR FACE... maybe transparent". Okay, let's use outline for these too mostly.
                        // I'll stick to primary for "Upgrade" to distinguish from build, but maybe user wants all less screamy.
                        // Let's try Outline for Upgrade too, or Secondary.
                        onClick={() =>
                          handleConstructHouse(plotId, "homestead")
                        }
                        disabled={!canAfford({ wood: 100, stone: 50 })}
                      >
                        Upgrade to Homestead (100{" "}
                        <ResourceIcon resource="wood" size={12} />, 50{" "}
                        <ResourceIcon resource="stone" size={12} />)
                      </Button>
                    )}
                    {isHomestead && (
                      <div className="text-center text-xs text-success font-semibold py-2">
                        Fully Upgraded
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- MAIN BUILDINGS SECTION --- */}
        <section>
          <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
            <Construction size={24} className="text-accent" />
            Infrastructure
          </h2>

          <div className="flex flex-col gap-4">
            {Object.entries(BUILDING_DEFINITIONS).map(([id, def]) => {
              const building = buildings[id as BuildingId];
              if (!building) return null; // Should not happen

              const isExpanded = expanded[id];
              const isMaxLevel = building.level >= def.maxLevel;
              const nextLevel = building.level + 1;
              const cost = getUpgradeCost(id as BuildingId, building.level);
              const affordable = canAfford(cost);
              const Icon = def.icon;

              return (
                <div
                  key={id}
                  className={`border rounded-lg bg-bg-main transition-all ${
                    isExpanded
                      ? "border-brand shadow-md"
                      : "border-border-main hover:border-border-light"
                  }`}
                >
                  {/* LOCKED OVERLAY / STATE */}
                  {!building.unlocked ? (
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 opacity-75">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="flex-none p-3 rounded-full bg-zinc-900/50 mr-4 text-text-muted border border-border-main">
                          <Lock size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-text-muted">
                            {def.name}
                          </h3>
                          <p className="text-sm text-text-muted">
                            Locked structure.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-sm font-mono text-text-muted flex gap-2">
                          {Object.entries(def.baseCost).map(([res, amt]) => (
                            <span key={res} className="flex items-center gap-1">
                              {amt} <ResourceIcon resource={res} size={12} />
                            </span>
                          ))}
                        </div>
                        <Button
                          onClick={() => handleUnlockBuilding(id as BuildingId)}
                          disabled={!canAfford(def.baseCost)}
                          variant="outline"
                          className="min-w-[100px]"
                        >
                          Unlock
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Row Header - Info | Material | Level */}
                      <div
                        className="flex items-center p-4 cursor-pointer"
                        onClick={() => toggleExpand(id)}
                      >
                        {/* Left: Info */}
                        <div className="flex items-center flex-1 min-w-0">
                          <div className="flex-none p-3 rounded-full bg-bg-panel mr-4 text-text-main border border-border-main">
                            <Icon size={24} />
                          </div>
                          <div className="min-w-0 truncate">
                            <h3 className="font-bold text-lg text-text-main truncate">
                              {def.name}
                            </h3>
                            <p className="text-sm text-text-secondary truncate">
                              {def.description}
                            </p>
                          </div>
                        </div>

                        {/* Middle: Material Output */}
                        <div className="hidden md:flex flex-1 justify-center px-4 border-l border-r border-border-main/20 mx-4">
                          <span className="text-sm text-text-muted italic text-center">
                            {def.effectDescription.split(".")[0]}
                          </span>
                        </div>

                        {/* Right: Level & Chevron */}
                        <div className="flex items-center gap-6 flex-none justify-end w-32">
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-text-muted uppercase font-bold">
                              Level
                            </span>
                            <div className="text-xl font-bold text-text-main">
                              {building.level}
                              <span className="text-text-muted text-base font-normal ml-1">
                                / {def.maxLevel}
                              </span>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp size={20} className="text-text-muted" />
                          ) : (
                            <ChevronDown
                              size={20}
                              className="text-text-muted"
                            />
                          )}
                        </div>
                      </div>

                      {/* Expanded Section */}
                      {isExpanded && !isMaxLevel && (
                        <div className="p-4 border-t border-border-main bg-bg-panel/30 flex flex-col sm:flex-row gap-6">
                          {/* Upgrade Details */}
                          <div className="flex-1 space-y-3">
                            <h4 className="font-bold text-text-main flex items-center gap-2">
                              <ArrowUpCircle
                                size={18}
                                className="text-accent"
                              />
                              Upgrade to Level {nextLevel}
                            </h4>
                            <p className="text-sm text-text-secondary">
                              <span className="font-semibold text-text-main">
                                Effect:
                              </span>{" "}
                              {def.effectDescription}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-text-muted">
                              <Clock size={16} />
                              <span>Time to build: {def.baseTime}s</span>
                            </div>
                          </div>

                          {/* Cost & Action */}
                          <div className="w-full sm:w-64 flex flex-col gap-3">
                            <div className="bg-bg-main p-3 rounded border border-border-main">
                              <div className="text-xs font-bold text-text-muted uppercase mb-2">
                                Required Resources
                              </div>
                              <div className="space-y-1">
                                {Object.entries(cost).map(([res, amount]) => (
                                  <div
                                    key={res}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <div className="flex items-center gap-2">
                                      <ResourceIcon resource={res} />
                                      <span className="capitalize text-text-secondary">
                                        {res}
                                      </span>
                                    </div>
                                    <span
                                      className={`${
                                        (resources[
                                          res as keyof typeof resources
                                        ] || 0) >= amount
                                          ? "text-text-main"
                                          : "text-danger"
                                      }`}
                                    >
                                      {amount}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Button
                              onClick={() =>
                                handleUpgradeBuilding(id as BuildingId)
                              }
                              disabled={!affordable}
                              variant="outline" // Using outline as requested
                              className="w-full justify-center"
                            >
                              Upgrade
                            </Button>
                          </div>
                        </div>
                      )}

                      {isExpanded && isMaxLevel && (
                        <div className="p-4 border-t border-border-main bg-bg-panel/30 text-center text-accent font-bold">
                          Max Level Reached
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Buildings;
