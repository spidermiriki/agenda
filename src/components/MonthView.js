import { MONTH_NAMES, DAY_NAMES, getMonthWeeks, formatDateKey, shiftMonth, isBeforeStart } from '../dateUtils';
import { getDayData } from '../storage';
import { assigneeColor } from '../assignees';

function getDayAssignees(day) {
  const { events } = getDayData(formatDateKey(day));
  return [...new Set(events.map((event) => event.assignedTo))];
}

function MonthView({ year, month, onBack, onSelectDay, onPrevMonth, onNextMonth }) {
  const weeks = getMonthWeeks(year, month);
  const today = formatDateKey(new Date());
  const prevTarget = shiftMonth(year, month, -1);
  const disablePrev = isBeforeStart(prevTarget.year, prevTarget.month);

  return (
    <div className="page month-page">
      <button className="btn btn-back" onClick={onBack}>{'< Retour aux mois'}</button>

      <div className="row-nav">
        <button className="btn btn-nav" onClick={onPrevMonth} disabled={disablePrev}>
          {'< Précédent'}
        </button>
        <h2 className="page-title">{MONTH_NAMES[month]} {year}</h2>
        <button className="btn btn-nav" onClick={onNextMonth}>{'Suivant >'}</button>
      </div>

      <div className="calendar-frame">
        <svg className="calendar-scribble calendar-scribble-tl" viewBox="0 0 60 20" width="46" height="16" aria-hidden="true">
          <path d="M2 14 Q10 2 18 12 T34 9 T50 13" stroke="var(--pencil-soft)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
        <svg className="calendar-scribble calendar-scribble-br" viewBox="0 0 60 20" width="46" height="16" aria-hidden="true">
          <path d="M2 14 Q10 2 18 12 T34 9 T50 13" stroke="var(--pencil-soft)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>

        <div className="calendar-grid">
          {DAY_NAMES.map((name) => (
            <div key={name} className="calendar-day-name">{name}</div>
          ))}

          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              if (!day) {
                return <div key={`${weekIndex}-${dayIndex}`} className="calendar-cell calendar-cell-empty" />;
              }
              const key = formatDateKey(day);
              const isToday = key === today;
              const assignees = getDayAssignees(day);
              return (
                <div key={`${weekIndex}-${dayIndex}`} className="calendar-cell">
                  <button
                    className={isToday ? 'day-number day-number-today' : 'day-number'}
                    onClick={() => onSelectDay(day)}
                  >
                    {day.getDate()}
                  </button>
                  <div className="calendar-dots">
                    {assignees.map((assignedTo) => (
                      <span
                        key={assignedTo}
                        className="calendar-dot"
                        style={{ backgroundColor: assigneeColor(assignedTo) }}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default MonthView;
