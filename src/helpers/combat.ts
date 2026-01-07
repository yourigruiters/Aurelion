import { MILITARY_TECHS, TechId } from "../store/militarySlice";

export const calculateMilitaryModifiers = (
  buildings: Record<string, { level: number; unlocked: boolean }>,
  unlockedTechs: TechId[],
  assignments: Record<string, number>
) => {
  // 1. Base Stats
  const warriorCount = assignments["Warrior"] || 0;
  const baseAttack = warriorCount; // 1 Attack per Warrior base

  // 2. Building Modifiers
  // The Forge: +5% Attack per level (starting from level 2)
  let buildingAttackMod = 0;
  if (buildings["the_forge"]?.unlocked && buildings["the_forge"].level > 1) {
    buildingAttackMod += (buildings["the_forge"].level - 1) * 0.05;
  }

  // Garrison: +5% Defense per level (starting from level 2)
  let buildingDefenseMod = 0;
  if (buildings["garrison"]?.unlocked && buildings["garrison"].level > 1) {
    buildingDefenseMod += (buildings["garrison"].level - 1) * 0.05;
  }

  // 3. Tech Modifiers
  let techAttackFlat = 0;
  let techDefenseFlat = 0;

  unlockedTechs.forEach((id) => {
    const tech = MILITARY_TECHS[id];
    if (tech.effects.attackBonus) {
      techAttackFlat += tech.effects.attackBonus * warriorCount;
    }
    if (tech.effects.defenseBonus) {
      techDefenseFlat += tech.effects.defenseBonus;
    }
  });

  // 4. Totals
  const totalRawAttack = baseAttack + techAttackFlat;
  const totalAttack = Math.floor(totalRawAttack * (1 + buildingAttackMod));

  const totalRawDefense = techDefenseFlat;
  const totalDefense = Math.floor(totalRawDefense * (1 + buildingDefenseMod));

  return {
    rawAttack: totalRawAttack,
    buildingAttackMod,
    totalAttack,
    rawDefense: totalRawDefense,
    buildingDefenseMod,
    totalDefense,
  };
};
