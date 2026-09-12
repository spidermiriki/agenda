import { useState } from 'react';
import './App.css';
import YearView from './components/YearView';
import MonthView from './components/MonthView';
import DayDetail from './components/DayDetail';
import GardenBackground from './components/GardenBackground';
import IntroOverlay from './components/IntroOverlay';
import { START_YEAR, shiftMonth } from './dateUtils';
import { TagsProvider } from './TagsContext';

function App() {
  const [year, setYear] = useState(START_YEAR);
  const [selectedMonth, setSelectedMonth] = useState(null); // 0-11 ou null
  const [selectedDay, setSelectedDay] = useState(null); // Date ou null

  function goToMonth(delta) {
    const shifted = shiftMonth(year, selectedMonth, delta);
    setYear(shifted.year);
    setSelectedMonth(shifted.month);
  }

  let content;
  if (selectedDay) {
    content = <DayDetail date={selectedDay} onBack={() => setSelectedDay(null)} />;
  } else if (selectedMonth !== null) {
    content = (
      <MonthView
        year={year}
        month={selectedMonth}
        onBack={() => setSelectedMonth(null)}
        onSelectDay={(day) => setSelectedDay(day)}
        onPrevMonth={() => goToMonth(-1)}
        onNextMonth={() => goToMonth(1)}
      />
    );
  } else {
    content = (
      <YearView
        year={year}
        onChangeYear={(delta) => setYear((y) => y + delta)}
        onSelectMonth={(month) => setSelectedMonth(month)}
      />
    );
  }

  return (
    <TagsProvider>
      <div className="App">
        <GardenBackground />
        {content}
        <IntroOverlay />
      </div>
    </TagsProvider>
  );
}

export default App;
