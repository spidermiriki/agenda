import { useState } from 'react';
import './App.css';
import YearView from './components/YearView';
import MonthView from './components/MonthView';
import DayDetail from './components/DayDetail';
import { START_YEAR, shiftMonth } from './dateUtils';

function App() {
  const [year, setYear] = useState(START_YEAR);
  const [selectedMonth, setSelectedMonth] = useState(null); // 0-11 ou null
  const [selectedDay, setSelectedDay] = useState(null); // Date ou null

  if (selectedDay) {
    return (
      <div className="App">
        <DayDetail date={selectedDay} onBack={() => setSelectedDay(null)} />
      </div>
    );
  }

  if (selectedMonth !== null) {
    const goToMonth = (delta) => {
      const shifted = shiftMonth(year, selectedMonth, delta);
      setYear(shifted.year);
      setSelectedMonth(shifted.month);
    };

    return (
      <div className="App">
        <MonthView
          year={year}
          month={selectedMonth}
          onBack={() => setSelectedMonth(null)}
          onSelectDay={(day) => setSelectedDay(day)}
          onPrevMonth={() => goToMonth(-1)}
          onNextMonth={() => goToMonth(1)}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <YearView
        year={year}
        onChangeYear={(delta) => setYear((y) => y + delta)}
        onSelectMonth={(month) => setSelectedMonth(month)}
      />
    </div>
  );
}

export default App;
