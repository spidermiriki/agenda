const STORAGE_KEY = 'planning_days_v1';

export function getAllDayData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function getDayData(dateKey) {
  const all = getAllDayData();
  return all[dateKey] || { events: [] };
}

export function saveDayData(dateKey, data) {
  const all = getAllDayData();
  all[dateKey] = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
