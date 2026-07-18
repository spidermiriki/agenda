export const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// Premier mois affiché dans le calendrier (juillet 2026, 0-indexé donc 6)
export const START_YEAR = 2026;
export const START_MONTH = 6;

export function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Découpe un mois en semaines (lignes de 7 jours, cases vides = null)
export function getMonthWeeks(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7; // 0 = lundi

  const weeks = [];
  let currentWeek = new Array(startOffset).fill(null);

  for (let day = 1; day <= lastDate; day++) {
    currentWeek.push(new Date(year, month, day));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return weeks;
}

export function isBeforeStart(year, month) {
  return year < START_YEAR || (year === START_YEAR && month < START_MONTH);
}

export function shiftMonth(year, month, delta) {
  const total = year * 12 + month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

export function monthRangeKeys(year, month) {
  return {
    start: formatDateKey(new Date(year, month, 1)),
    end: formatDateKey(new Date(year, month + 1, 0)),
  };
}
