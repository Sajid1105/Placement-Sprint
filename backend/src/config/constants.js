export const SPRINT_START = process.env.SPRINT_START_DATE || '2025-06-01';
export const SPRINT_DAYS = parseInt(process.env.SPRINT_DURATION_DAYS || '60', 10);
export const DAILY_GOAL_HOURS = 5;

export function getSprintStartDate() {
  return new Date(SPRINT_START + 'T00:00:00');
}

export function getSprintEndDate() {
  const end = getSprintStartDate();
  end.setDate(end.getDate() + SPRINT_DAYS - 1);
  return end;
}

export function dayNumberFromDate(date) {
  const start = getSprintStartDate();
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((d - start) / (1000 * 60 * 60 * 24)) + 1;
  return diff;
}

export function dateFromDayNumber(day) {
  const d = getSprintStartDate();
  d.setDate(d.getDate() + day - 1);
  return d;
}
