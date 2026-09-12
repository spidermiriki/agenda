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
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

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
      {/* Fond électro derrière la console */}
      <GardenBackground />
      {/* Écran de boot par-dessus tout */}
      <IntroOverlay />

      <div className="gameboy-shell">

        {/* Bande supérieure : logo + LED */}
        <div className="gameboy-header">
          <span className="gameboy-logo">■ AGENDA BOY</span>
          <span className="gameboy-led" aria-hidden="true" />
        </div>

        {/* Encadrement + écran */}
        <div className="gameboy-screen-frame">
          <div className="gameboy-screen">
            <div className="App">
              {content}
            </div>
          </div>
        </div>

        {/* Commandes : D-pad + boutons A/B */}
        <div className="gameboy-controls-row" aria-hidden="true">
          <div className="gameboy-dpad">
            <div className="dpad-h" />
            <div className="dpad-v" />
            <div className="dpad-center" />
          </div>
          <div className="gameboy-ab-area">
            <div className="gameboy-ab-buttons">
              <span className="gb-btn gb-btn-b">B</span>
              <span className="gb-btn gb-btn-a">A</span>
            </div>
          </div>
        </div>

        {/* Bas : SELECT / START + haut-parleur */}
        <div className="gameboy-bottom-row" aria-hidden="true">
          <div className="gameboy-select-start">
            <span className="gb-sys-btn">SELECT</span>
            <span className="gb-sys-btn">START</span>
          </div>
          <div className="gameboy-speaker">
            {Array.from({ length: 18 }, (_, i) => (
              <span key={i} className="speaker-dot" />
            ))}
          </div>
        </div>

      </div>
    </TagsProvider>
  );
}

export default App;
