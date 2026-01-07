import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  BUILDING_DEFINITIONS,
  BuildingId,
  HouseType,
} from "../store/buildingsSlice";
import { startBuildingProject } from "../store/gameThunks";
import Button from "../components/ui/Button";
import { RESOURCE_ORDER } from "../helpers/resource";
import {
  Home,
  Users,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowUpCircle,
  Construction,
  Coins,
  Lock,
} from "lucide-react";
import ResourceIcon from "../components/ui/ResourceIcon";
import ResourceDisplay from "../components/ui/ResourceDisplay";

// Local helper removed

const Buildings: React.FC = () => {
  const dispatch = useDispatch();
  // @ts-ignore
  // @ts-ignore
  const { buildings, housing, constructionQueue } = useSelector(
    (state: RootState) => state.buildings
  );
  const { resources } = useSelector((state: RootState) => state.resources);
  // const { level: playerLevel } = useSelector((state: RootState) => state.game);
  // Use Town Keep Level
  const townKeepLevel = buildings["town_keep"]?.level || 0;

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
    // Sort logic will be applied at display time or we return sorted?
    // Returning object, order is keys dependent but usually insertion order.
    // It's safer to sort at call sites or here?
    // Let's rely on display sites sorting using RESOURCE_ORDER.
    return cost;
  };

  // NOTE: We now use dispatch(startBuildingProject(...)) instead of direct actions

  const handleUpgradeBuilding = (id: BuildingId) => {
    const building = buildings[id];
    if (!building) return;
    const def = BUILDING_DEFINITIONS[id];

    // Check level req
    // if (playerLevel < def.requiredLevel) return;
    if (townKeepLevel < def.requiredLevel) return;

    const cost = getUpgradeCost(id, building.level);

    if (canAfford(cost)) {
      // dispatch(deductResources(cost));
      // dispatch(upgradeBuilding(id));
      // dispatch(addExperience(def.experience));

      // NEW: Start Project
      dispatch(
        // @ts-ignore
        startBuildingProject(
          {
            buildingId: id,
            type: "building_upgrade",
            targetLevel: building.level + 1,
            remainingDays: def.buildTimeDays,
            name: `Upgrade ${def.name} to Level ${building.level + 1}`,
            totalDays: def.buildTimeDays,
          },
          cost
        )
      );
      // We do NOT add experience immediately now? Or should we?
      // Usually XP is on completion.
    }
  };

  const handleUnlockBuilding = (id: BuildingId) => {
    const def = BUILDING_DEFINITIONS[id];
    // Check level req
    // if (playerLevel < def.requiredLevel) return;
    if (townKeepLevel < def.requiredLevel) return;

    const cost = def.baseCost;

    if (canAfford(cost)) {
      // dispatch(deductResources(cost));
      // dispatch(unlockBuilding(id));
      // dispatch(addExperience(def.experience));

      dispatch(
        // @ts-ignore
        startBuildingProject(
          {
            buildingId: id,
            type: "building_unlock",
            remainingDays: def.buildTimeDays,
            name: `Construct ${def.name}`,
            totalDays: def.buildTimeDays,
          },
          cost
        )
      );
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
      // dispatch(deductResources(cost));

      if (type === "cottage") {
        // dispatch(constructHouse({ plotId, type }));
        dispatch(
          // @ts-ignore
          startBuildingProject(
            {
              buildingId: plotId.toString(),
              type: "house_construct",
              targetHouseType: "cottage",
              remainingDays: 1, // Cottages are fast? Let's say 1 day.
              name: `Build Cottage (Plot ${plotId})`,
              totalDays: 1,
            },
            cost
          )
        );
      } else if (type === "homestead") {
        if (housing[plotId].type === "cottage") {
          // dispatch(upgradeHouse(plotId));
          dispatch(
            // @ts-ignore
            startBuildingProject(
              {
                buildingId: plotId.toString(),
                type: "house_upgrade",
                targetHouseType: "homestead",
                remainingDays: 2, // Upgrade takes 2 days
                name: `Upgrade to Homestead (Plot ${plotId})`,
                totalDays: 2,
              },
              cost
            )
          );
        } else {
          // Direct build
          // dispatch(constructHouse({ plotId, type }));
          dispatch(
            // @ts-ignore
            startBuildingProject(
              {
                buildingId: plotId.toString(),
                type: "house_construct",
                targetHouseType: "homestead",
                remainingDays: 3, // Direct build takes longer
                name: `Build Homestead (Plot ${plotId})`,
                totalDays: 3,
              },
              cost
            )
          );
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

              // Check if in queue
              const underConstruction = constructionQueue.find(
                (q) => q.buildingId === plotId.toString()
              );

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
                    {underConstruction ? (
                      <div className="bg-bg-panel/50 p-3 rounded border border-brand/30 text-center">
                        <div className="text-xs font-bold text-brand uppercase mb-1">
                          Under Construction
                        </div>
                        <div className="text-sm font-bold text-text-main">
                          {underConstruction.remainingDays} Days Left
                        </div>
                      </div>
                    ) : (
                      <>
                        {isEmpty && (
                          <div className="space-y-3">
                            {/* Cottage Option */}
                            <div className="bg-bg-panel/50 p-2 rounded border border-border-main/50">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-text-main">
                                    Small Cottage
                                  </span>
                                  <span className="flex items-center gap-1 text-[10px] text-text-muted mt-0.5">
                                    <Clock size={12} /> 1 Day
                                  </span>
                                  <span className="flex items-center gap-1 text-[10px] text-brand mt-0.5">
                                    <ArrowUpCircle size={12} /> +5 XP
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ResourceIcon resource="wood" size={12} />
                                  <span
                                    className={`text-xs ${
                                      resources.wood >= 50
                                        ? "text-text-main"
                                        : "text-danger"
                                    }`}
                                  >
                                    50
                                  </span>
                                </div>
                              </div>
                              <Button
                                className="w-full text-xs"
                                variant="outline"
                                onClick={() =>
                                  handleConstructHouse(plotId, "cottage")
                                }
                                disabled={!canAfford({ wood: 50 })}
                              >
                                Build Cottage
                              </Button>
                            </div>

                            {/* Homestead Option */}
                            <div className="bg-bg-panel/50 p-2 rounded border border-border-main/50">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-text-main">
                                    Homestead
                                  </span>
                                  <span className="flex items-center gap-1 text-[10px] text-text-muted mt-0.5">
                                    <Clock size={12} /> 3 Days
                                  </span>
                                  <span className="flex items-center gap-1 text-[10px] text-brand mt-0.5">
                                    <ArrowUpCircle size={12} /> +10 XP
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1">
                                    <ResourceIcon resource="wood" size={12} />
                                    <span
                                      className={`text-xs ${
                                        resources.wood >= 150
                                          ? "text-text-main"
                                          : "text-danger"
                                      }`}
                                    >
                                      150
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <ResourceIcon resource="stone" size={12} />
                                    <span
                                      className={`text-xs ${
                                        resources.stone >= 50
                                          ? "text-text-main"
                                          : "text-danger"
                                      }`}
                                    >
                                      50
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                className="w-full text-xs"
                                variant="outline"
                                onClick={() =>
                                  handleConstructHouse(plotId, "homestead")
                                }
                                disabled={!canAfford({ wood: 150, stone: 50 })}
                              >
                                Build Homestead
                              </Button>
                            </div>
                          </div>
                        )}
                        {isCottage && (
                          <div className="bg-bg-panel/50 p-2 rounded border border-border-main/50">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-text-main">
                                  Homestead
                                </span>
                                <span className="flex items-center gap-1 text-[10px] text-text-muted mt-0.5">
                                  <Clock size={12} /> 2 Days
                                </span>
                                <span className="flex items-center gap-1 text-[10px] text-brand mt-0.5">
                                  <ArrowUpCircle size={12} /> +10 XP
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <ResourceIcon resource="wood" size={12} />
                                  <span
                                    className={`text-xs ${
                                      resources.wood >= 100
                                        ? "text-text-main"
                                        : "text-danger"
                                    }`}
                                  >
                                    100
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ResourceIcon resource="stone" size={12} />
                                  <span
                                    className={`text-xs ${
                                      resources.stone >= 50
                                        ? "text-text-main"
                                        : "text-danger"
                                    }`}
                                  >
                                    50
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              className="w-full text-xs"
                              variant="outline"
                              onClick={() =>
                                handleConstructHouse(plotId, "homestead")
                              }
                              disabled={!canAfford({ wood: 100, stone: 50 })}
                            >
                              Upgrade
                            </Button>
                          </div>
                        )}
                        {isHomestead && (
                          <div className="text-center text-xs text-success font-semibold py-2">
                            Fully Upgraded
                          </div>
                        )}
                      </>
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
              // const levelLocked = playerLevel < def.requiredLevel;
              const levelLocked = townKeepLevel < def.requiredLevel;
              const Icon = def.icon;

              const underConstruction = constructionQueue.find(
                (q) => q.buildingId === id
              );

              return (
                <div
                  key={id}
                  className={`border rounded-lg bg-bg-main transition-all ${
                    isExpanded
                      ? "border-brand shadow-md"
                      : "border-border-main hover:border-border-light"
                  }`}
                >
                  {/* UNIFIED CARD HEADER (Locked or Unlocked) */}
                  <div
                    className="flex items-center p-4 cursor-pointer"
                    onClick={() => toggleExpand(id)}
                  >
                    {/* Left: Info */}
                    <div className="flex items-center flex-1 min-w-0">
                      <div
                        className={`flex-none p-3 rounded-full mr-4 border ${
                          !building.unlocked
                            ? "bg-zinc-900/50 text-text-muted border-border-main"
                            : "bg-bg-panel text-text-main border-border-main"
                        }`}
                      >
                        {!building.unlocked ? (
                          <Lock size={24} />
                        ) : (
                          <Icon size={24} />
                        )}
                      </div>
                      <div className="min-w-0 truncate">
                        <h3
                          className={`font-bold text-lg truncate ${
                            !building.unlocked
                              ? "text-text-muted"
                              : "text-text-main"
                          }`}
                        >
                          {def.name}
                        </h3>
                        <p className="text-sm text-text-secondary truncate">
                          {def.description}
                        </p>
                      </div>
                    </div>

                    {/* Middle: Material Output (Hidden if locked) */}
                    {building.unlocked && (
                      <div className="hidden md:flex flex-1 justify-center px-4 border-l border-r border-border-main/20 mx-4">
                        <span className="text-sm text-text-muted italic text-center">
                          {def.effectDescription.split(".")[0]}
                        </span>
                      </div>
                    )}

                    {/* Right: Level & Chevron */}
                    <div className="flex items-center gap-6 flex-1 justify-end w-32">
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-text-muted uppercase font-bold">
                          {!building.unlocked ? "Locked" : "Level"}
                        </span>
                        {!building.unlocked ? (
                          <span className="text-xs text-danger font-bold">
                            Requires Town Keep Lv {def.requiredLevel}
                          </span>
                        ) : (
                          <div
                            className={`text-xl font-bold ${
                              isMaxLevel ? "text-success" : "text-text-main"
                            }`}
                          >
                            {building.level}
                            <span
                              className={`text-base font-normal ml-1 ${
                                isMaxLevel ? "text-success" : "text-text-muted"
                              }`}
                            >
                              / {def.maxLevel}
                            </span>
                          </div>
                        )}
                        {underConstruction && (
                          <span className="text-xs text-brand font-bold animate-pulse">
                            Scaling Up...
                          </span>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-text-muted" />
                      ) : (
                        <ChevronDown size={20} className="text-text-muted" />
                      )}
                    </div>
                  </div>

                  {/* EXPANDED CONTENT */}
                  {isExpanded && (
                    <div className="p-4 border-t border-border-main bg-bg-panel/30 flex flex-col sm:flex-row gap-6">
                      {/* LEFT: Info / Upgrade Progression */}
                      <div className="flex-1 space-y-4">
                        {!building.unlocked ? (
                          <div className="space-y-2">
                            <div className="text-sm font-bold text-text-main">
                              Building Information
                            </div>
                            <p className="text-sm text-text-secondary">
                              {def.description}
                            </p>
                            <div className="p-3 bg-bg-main rounded border border-border-main mt-2">
                              <div className="text-xs font-bold text-text-muted uppercase mb-1">
                                Effect
                              </div>
                              <div className="text-sm text-text-main">
                                {def.effectDescription}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-text-muted mt-2">
                              <div className="flex items-center gap-1">
                                <Clock size={16} />
                                <span>
                                  {def.buildTimeDays} Days Construction
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ArrowUpCircle
                                  size={16}
                                  className="text-brand"
                                />
                                <span>+{def.experience} XP</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Current Benefit - Maybe redundant if we show progression? */}
                            {/* FUTURE LEVELS LIST */}
                            {building.level < def.maxLevel && (
                              <div className="space-y-2">
                                <h4 className="font-bold text-text-main flex items-center gap-2 text-sm uppercase tracking-wider">
                                  <ArrowUpCircle
                                    size={16}
                                    className="text-accent"
                                  />
                                  Upgrade Progression
                                </h4>
                                <div className="space-y-2">
                                  {Array.from(
                                    { length: def.maxLevel - building.level },
                                    (_, i) => {
                                      const lvl = building.level + 1 + i;
                                      // We only show next 3 levels to avoid clutter? Or all? User said "exact information for what a user will get at every single level upgrade"
                                      // Let's show all remaining levels.

                                      // For description scaling, we might have to just repeat the static description if we don't have formula.
                                      // But we can format it nicely.
                                      const isNext = lvl === building.level + 1;
                                      const lvlCost = getUpgradeCost(
                                        id as BuildingId,
                                        lvl - 1
                                      ); // Cost to get TO this level (from prev)

                                      return (
                                        <div
                                          key={lvl}
                                          className={`p-2 rounded border ${
                                            isNext
                                              ? "bg-bg-main border-brand/50"
                                              : "border-transparent opacity-60"
                                          }`}
                                        >
                                          <div className="flex justify-between items-center mb-1">
                                            <span
                                              className={`font-bold text-sm ${
                                                isNext
                                                  ? "text-brand"
                                                  : "text-text-muted"
                                              }`}
                                            >
                                              Level {lvl} {isNext && "(Next)"}
                                            </span>
                                            {/* Cost Display for this level */}
                                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                                              {Object.entries(lvlCost)
                                                .sort(
                                                  (a, b) =>
                                                    RESOURCE_ORDER.indexOf(
                                                      a[0]
                                                    ) -
                                                    RESOURCE_ORDER.indexOf(b[0])
                                                )
                                                .map(([res, amt]) => (
                                                  <span
                                                    key={res}
                                                    className="flex items-center gap-1"
                                                  >
                                                    {amt}{" "}
                                                    <ResourceIcon
                                                      resource={res}
                                                      size={10}
                                                    />
                                                  </span>
                                                ))}
                                            </div>
                                          </div>
                                          <div className="text-xs text-text-secondary">
                                            Effect:{" "}
                                            <span className="text-text-main">
                                              {def.effectDescription}
                                            </span>
                                            {/* If we had specific numbers we would put them here. E.g. "Production: 100 -> 120" */}
                                            <div className="mt-1 text-brand">
                                              + {def.experience} XP
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}

                            {/* If Max Level */}
                            {isMaxLevel && (
                              <div className="p-4 text-center text-accent font-bold border border-accent/20 rounded bg-accent/5">
                                Max Level Reached
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* RIGHT: Action / Cost (Next Level Only) */}
                      {!isMaxLevel && (
                        <div className="w-full sm:w-64 flex flex-col gap-3">
                          {/* Only show cost block for the NEXT action */}
                          <div className="bg-bg-main p-3 rounded border border-border-main">
                            <div className="text-xs font-bold text-text-muted uppercase mb-2">
                              {building.unlocked
                                ? "Next Upgrade Cost"
                                : "Unlock Cost"}
                            </div>
                            <div className="space-y-1">
                              <div className="space-y-1">
                                {Object.entries(
                                  building.unlocked ? cost : def.baseCost
                                )
                                  .sort(
                                    (a, b) =>
                                      RESOURCE_ORDER.indexOf(a[0]) -
                                      RESOURCE_ORDER.indexOf(b[0])
                                  )
                                  .map(([res, amount]) => (
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
                          </div>

                          {/* ACTION BUTTONS */}
                          {!building.unlocked ? (
                            levelLocked ? (
                              <div className="bg-bg-main p-3 rounded border border-danger/30">
                                <span className="text-xs font-bold text-danger uppercase mb-1 block">
                                  Requirements
                                </span>
                                <ul className="list-disc list-inside text-xs text-danger/80 space-y-0.5">
                                  <li>Town Keep Lv {def.requiredLevel}</li>
                                </ul>
                              </div>
                            ) : underConstruction ? (
                              <div className="bg-bg-main p-3 rounded border border-brand/30 text-center">
                                <span className="text-xs font-bold text-brand uppercase block mb-1">
                                  Construction in progress
                                </span>
                                <span className="text-lg font-bold text-text-main">
                                  {underConstruction?.remainingDays} Days Left
                                </span>
                              </div>
                            ) : (
                              <Button
                                onClick={() =>
                                  handleUnlockBuilding(id as BuildingId)
                                }
                                disabled={!canAfford(def.baseCost)}
                                variant="outline"
                                className="w-full justify-center"
                              >
                                Unlock Building
                              </Button>
                            )
                          ) : underConstruction ? (
                            <div className="bg-bg-main p-3 rounded border border-brand/30 text-center">
                              <span className="text-xs font-bold text-brand uppercase block mb-1">
                                Construction in progress
                              </span>
                              <span className="text-lg font-bold text-text-main">
                                {underConstruction?.remainingDays} Days Left
                              </span>
                            </div>
                          ) : (
                            <Button
                              onClick={() =>
                                handleUpgradeBuilding(id as BuildingId)
                              }
                              disabled={!affordable}
                              variant="outline"
                              className="w-full justify-center"
                            >
                              Upgrade to Level {nextLevel}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
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
