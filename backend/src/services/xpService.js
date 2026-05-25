export function xpForMinutes(minutes) {
  return Math.floor(minutes / 10) * 5;
}

export function levelFromXp(xp) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export async function addXp(user, amount) {
  user.xp += amount;
  user.level = levelFromXp(user.xp);
  await user.save();
  return { xp: user.xp, level: user.level, gained: amount };
}
