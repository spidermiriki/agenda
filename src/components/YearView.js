import { MONTH_NAMES, START_YEAR, isBeforeStart } from '../dateUtils';

function YearView({ year, onChangeYear, onSelectMonth }) {
  return (
    <div className="page year-page">
      <div className="row-nav">
        <button className="btn btn-nav" onClick={() => onChangeYear(-1)} disabled={year <= START_YEAR}>
          {'< Année précédente'}
        </button>
        <h2 className="page-title">{year}</h2>
        <button className="btn btn-nav" onClick={() => onChangeYear(1)}>{'Année suivante >'}</button>
      </div>

      <div className="hand-frame">
        <div className="month-list">
          {MONTH_NAMES.map((name, index) => {
            const disabled = isBeforeStart(year, index);
            return (
              <button
                key={name}
                className="btn btn-month"
                disabled={disabled}
                onClick={() => onSelectMonth(index)}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default YearView;
