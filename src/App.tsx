import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Printer, Save, Calendar as CalendarIcon, FileText, X } from 'lucide-react';
import { SCHEDULE_DATA, Game } from './constants';

const MONTHS = [
  { name: 'March / April', printName: 'MAR./APR.', year: 2026, startMonth: 2, endMonth: 3 },
  { name: 'May', printName: 'MAY', year: 2026, startMonth: 4, endMonth: 4 },
  { name: 'June', printName: 'JUNE', year: 2026, startMonth: 5, endMonth: 5 },
  { name: 'July', printName: 'JULY', year: 2026, startMonth: 6, endMonth: 6 },
  { name: 'August', printName: 'AUGUST', year: 2026, startMonth: 7, endMonth: 7 },
  { name: 'September', printName: 'SEPTEMBER', year: 2026, startMonth: 8, endMonth: 8 },
];

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function App() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  const [showPrintWarning, setShowPrintWarning] = useState(false);
  const [showHomeOnly, setShowHomeOnly] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mariners-notes');
      if (stored) setNotes(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to load notes', err);
    }
  }, []);

  const saveNote = (id: string, content: string) => {
    setNotes(prev => {
      const updated = { ...prev, [id]: content };
      try {
        localStorage.setItem('mariners-notes', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save note', err);
      }
      return updated;
    });
  };

  const handlePrint = () => {
    try {
      if (window.self !== window.top) {
        setShowPrintWarning(true);
      } else {
        window.print();
      }
    } catch (e) {
      // Accessing window.top from a cross-origin iframe throws an error
      setShowPrintWarning(true);
    }
  };

  const nextMonth = () => {
    if (currentMonthIdx < MONTHS.length - 1) {
      setDirection(1);
      setCurrentMonthIdx(currentMonthIdx + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonthIdx > 0) {
      setDirection(-1);
      setCurrentMonthIdx(currentMonthIdx - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="no-print bg-mariners-navy border-b border-mariners-teal/30 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <CalendarIcon className="text-mariners-teal w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tighter uppercase italic">
            Mariners <span className="text-mariners-teal">2026</span> Schedule
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-mariners-navy border border-mariners-teal/30 rounded-lg p-1 mr-2 no-print">
            <button
              onClick={() => setShowHomeOnly(false)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${!showHomeOnly ? 'bg-mariners-teal text-white' : 'text-mariners-silver hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setShowHomeOnly(true)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${showHomeOnly ? 'bg-mariners-teal text-white' : 'text-mariners-silver hover:text-white'}`}
            >
              Home
            </button>
          </div>
          <a
            href="/regular-season-schedule.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-mariners-navy border border-mariners-teal text-mariners-teal hover:bg-mariners-teal hover:text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
          >
            <FileText size={18} />
            Original PDF
          </a>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-mariners-teal hover:bg-mariners-teal/80 px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
          >
            <Printer size={18} />
            Print Schedule
          </button>

        </div>
      </header>

      {/* Main Content / Film Strip */}
      <main className="flex-1 relative overflow-hidden bg-zinc-950 no-print bg-[url('/logo.png')] bg-center bg-no-repeat bg-cover bg-fixed">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentMonthIdx}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="absolute inset-0 p-4 md:p-8 flex flex-col justify-center"
          >
            <div className="w-full max-w-7xl mx-auto h-[85vh] md:h-[80vh]">
              <MonthCalendar
                monthInfo={MONTHS[currentMonthIdx]}
                notes={notes}
                onSaveNote={saveNote}
                showHomeOnly={showHomeOnly}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute inset-y-0 left-0 flex items-center p-4 z-10">
          <button
            onClick={prevMonth}
            disabled={currentMonthIdx === 0}
            className="p-3 rounded-full bg-mariners-navy/80 border border-mariners-teal/30 hover:bg-mariners-teal transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={32} />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center p-4 z-10">
          <button
            onClick={nextMonth}
            disabled={currentMonthIdx === MONTHS.length - 1}
            className="p-3 rounded-full bg-mariners-navy/80 border border-mariners-teal/30 hover:bg-mariners-teal transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </main>

      {/* Printable Version (Hidden in UI) */}
      <div className="print-only bg-white text-black">
        {MONTHS.map((month, idx) => (
          <div key={idx} className="month-page">
            <MonthCalendar
              monthInfo={month}
              notes={notes}
              onSaveNote={() => { }}
              isPrintMode={true}
              showHomeOnly={showHomeOnly}
            />
          </div>
        ))}
      </div>

      {/* Print Warning Modal */}
      {showPrintWarning && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 no-print">
          <div className="bg-mariners-navy border border-mariners-teal p-6 rounded-xl max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowPrintWarning(false)} className="absolute top-4 right-4 text-mariners-silver hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-mariners-teal mb-4 flex items-center gap-2">
              <Printer size={24} /> Print Schedule
            </h3>
            <p className="text-mariners-silver mb-6 text-sm leading-relaxed">
              Printing is restricted while viewing inside this preview window.
              <br /><br />
              To print your schedule, please open the application in a new tab using the <strong>Open in new tab</strong> button (usually an arrow icon in the top right of the preview header), then click Print again.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowPrintWarning(false)}
                className="bg-mariners-teal hover:bg-mariners-teal/80 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MonthCalendarProps {
  monthInfo: any;
  notes: { [key: string]: string };
  onSaveNote: (id: string, content: string) => void;
  isPrintMode?: boolean;
  showHomeOnly?: boolean;
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({
  monthInfo,
  notes,
  onSaveNote,
  isPrintMode = false,
  showHomeOnly = false
}) => {
  const { name, printName, year, startMonth, endMonth } = monthInfo;

  // Generate all days for the month(s)
  const days: Date[] = [];

  // For Mar/Apr, we handle them together
  if (startMonth !== endMonth) {
    // March 2026
    const marchStart = new Date(2026, 2, 1);
    const marchEnd = new Date(2026, 3, 0);
    for (let d = 26; d <= marchEnd.getDate(); d++) {
      days.push(new Date(2026, 2, d));
    }
    // April 2026
    const aprilEnd = new Date(2026, 4, 0);
    for (let d = 1; d <= aprilEnd.getDate(); d++) {
      days.push(new Date(2026, 3, d));
    }
  } else {
    const monthStart = new Date(year, startMonth, 1);
    const monthEnd = new Date(year, startMonth + 1, 0);
    for (let d = 1; d <= monthEnd.getDate(); d++) {
      days.push(new Date(year, startMonth, d));
    }
  }

  // Padding for the start of the week
  const firstDayOfWeek = days[0].getDay();
  const totalCells = firstDayOfWeek + days.length;

  const showMonthAtStart = isPrintMode && firstDayOfWeek >= 3;
  const showMonthAtEnd = isPrintMode && !showMonthAtStart;

  const startPaddingCount = showMonthAtStart ? firstDayOfWeek - 3 : firstDayOfWeek;
  const startPadding = Array(startPaddingCount).fill(null);

  const printEndPaddingCount = 42 - totalCells;
  const normalEndPaddingCount = (7 - (totalCells % 7)) % 7;

  const endPaddingCount = isPrintMode
    ? (showMonthAtEnd ? printEndPaddingCount - 4 : printEndPaddingCount)
    : normalEndPaddingCount;

  const endPadding = Array(endPaddingCount).fill(null);

  return (
    <div className={`h-full flex flex-col relative ${isPrintMode ? 'text-black' : 'text-white'}`}>
      {!isPrintMode && (
        <div className="absolute -top-4 md:-top-6 left-4 md:left-8 z-20 pointer-events-none flex items-baseline gap-4 opacity-40 drop-shadow-lg">
          <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-mariners-teal">
            {name}
          </h2>
          <span className="text-2xl md:text-4xl font-light text-mariners-silver">{year}</span>
        </div>
      )}

      <div className={`grid grid-cols-7 gap-[2px] flex-1 min-h-0 z-10 ${isPrintMode ? 'bg-mariners-navy border-2 border-mariners-navy grid-rows-[repeat(6,minmax(0,1fr))]' : 'bg-mariners-teal/20 border border-mariners-teal/20 rounded-xl overflow-hidden backdrop-blur-md'}`}>
        {!isPrintMode && DAYS_OF_WEEK.map(day => (
          <div key={day} className="p-2 text-center text-xs font-bold tracking-widest bg-mariners-navy/80 text-mariners-silver backdrop-blur-sm h-auto">
            {day}
          </div>
        ))}

        {showMonthAtStart && (
          <div
            className="bg-[#cbd5e1] text-mariners-navy flex items-center justify-center font-black uppercase tracking-widest text-6xl col-span-3 h-full min-h-0"
          >
            {printName || name}
          </div>
        )}

        {startPadding.map((_, i) => (
          <div key={`pad-${i}`} className={`${isPrintMode ? 'bg-white h-full min-h-0' : 'bg-mariners-navy/20'}`} />
        ))}

        {days.map(date => {
          const dateStr = date.toISOString().split('T')[0];
          const game = SCHEDULE_DATA.find(g => g.date === dateStr);
          const displayGame = showHomeOnly && game && !game.isHome ? undefined : game;
          const note = notes[dateStr] || '';

          return (
            <DayCell
              key={dateStr}
              date={date}
              game={displayGame}
              note={note}
              onSaveNote={(content) => onSaveNote(dateStr, content)}
              isPrintMode={isPrintMode}
            />
          );
        })}

        {endPadding.map((_, i) => (
          <div key={`end-pad-${i}`} className={`${isPrintMode ? 'bg-white h-full min-h-0' : 'bg-mariners-navy/20'}`} />
        ))}

        {showMonthAtEnd && (
          <div
            className="bg-[#cbd5e1] text-mariners-navy flex items-center justify-center font-black uppercase tracking-widest text-6xl col-span-4 h-full min-h-0"
          >
            {printName || name}
          </div>
        )}
      </div>
    </div>
  );
}

interface DayCellProps {
  date: Date;
  game?: Game;
  note: string;
  onSaveNote: (content: string) => void;
  isPrintMode: boolean;
}

const TEAM_ABBR: Record<string, string> = {
  'Guardians': 'CLE',
  'Yankees': 'NYY',
  'Angels': 'LAA',
  'Rangers': 'TEX',
  'Astros': 'HOU',
  'Padres': 'SD',
  'Athletics': 'OAK',
  'Cardinals': 'STL',
  'Twins': 'MIN',
  'Royals': 'KC',
  'Braves': 'ATL',
  'White Sox': 'CWS',
  'D-backs': 'ARI',
  'Mets': 'NYM',
  'Tigers': 'DET',
  'Orioles': 'BAL',
  'Nationals': 'WSH',
  'Red Sox': 'BOS',
  'Pirates': 'PIT',
  'Blue Jays': 'TOR',
  'Marlins': 'MIA',
  'Rays': 'TB',
  'Giants': 'SF',
  'Reds': 'CIN',
  'Dodgers': 'LAD',
  'Brewers': 'MIL',
  'Cubs': 'CHC',
  'Phillies': 'PHI',
  'Rockies': 'COL'
};

const DayCell: React.FC<DayCellProps> = ({
  date,
  game,
  note,
  onSaveNote,
  isPrintMode
}) => {
  const [localNote, setLocalNote] = useState(note);
  const day = date.getDate();
  const isToday = new Date().toDateString() === date.toDateString();

  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const isHome = game?.isHome;
  const isAway = game && !game.isHome;

  let bgClass = '';
  let textClass = '';
  let timeClass = '';
  let badgeClass = '';
  let inputClass = '';

  if (isPrintMode) {
    if (isHome) {
      bgClass = 'bg-white text-mariners-navy ring-4 ring-mariners-navy ring-inset';
      textClass = 'text-zinc-950';
      timeClass = 'text-mariners-navy/90';
      badgeClass = 'text-mariners-navy';
    } else if (isAway) {
      bgClass = 'bg-[#506464]/30 border border-[#506464]/20';
      textClass = 'text-gray-500';
      timeClass = 'text-mariners-navy/50';
      badgeClass = 'text-mariners-navy';
    } else {
      bgClass = 'bg-white text-mariners-navy';
      textClass = 'text-mariners-navy';
    }
  } else {
    if (isHome) {
      bgClass = 'bg-mariners-navy/80 border border-mariners-teal/30';
      textClass = 'text-white';
      timeClass = 'text-mariners-silver';
      badgeClass = 'bg-mariners-teal text-white';
      inputClass = 'text-white placeholder:text-white/30';
    } else if (isAway) {
      bgClass = 'bg-[#506464] border border-[#506464]';
      textClass = 'text-white';
      timeClass = 'text-white/70';
      badgeClass = 'bg-mariners-navy text-white';
      inputClass = 'text-white placeholder:text-white/40';
    } else {
      bgClass = 'bg-mariners-navy/40 hover:bg-mariners-navy/60 border border-transparent';
      textClass = 'text-white';
      inputClass = 'text-mariners-silver placeholder:text-mariners-silver/20';
    }
  }

  return (
    <div className={`group relative flex flex-col h-full min-h-0 p-2 transition-colors ${bgClass} ${isToday && !isPrintMode ? 'ring-2 ring-mariners-teal ring-inset' : ''}`}>
      <div className="flex justify-between items-start mb-1">
        <span className={`text-lg font-bold ${isToday && !isPrintMode ? 'text-mariners-teal' : textClass}`}>
          {day}
        </span>
        {!isPrintMode && game && (
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${badgeClass}`}>
            {game.isHome ? 'vs ' : '@ '}{game.opponent}
          </span>
        )}
      </div>

      {game && (
        <div className={`flex flex-col ${isPrintMode ? 'items-center justify-center flex-1 -mt-4' : 'mb-1'}`}>
          {isPrintMode && (
            <div className={`text-sm font-black uppercase tracking-widest ${badgeClass}`}>
              {game.isHome ? 'VS ' : '@ '}{TEAM_ABBR[game.opponent] || game.opponent}
            </div>
          )}
          <div className={`text-[10px] font-bold uppercase tracking-tight ${timeClass}`}>
            {game.time}
          </div>
          {game.promotion && (
            <div className={`text-[9px] leading-tight font-medium mt-0.5 ${isPrintMode ? 'text-mariners-navy/80 text-center px-1' : 'text-mariners-teal'}`}>
              {game.promotion}
            </div>
          )}
        </div>
      )}

      {isPrintMode ? (
        <div className="text-xs italic whitespace-pre-wrap mt-auto text-gray-700">
          {note}
        </div>
      ) : (
        <textarea
          value={localNote}
          onChange={(e) => setLocalNote(e.target.value)}
          onBlur={() => onSaveNote(localNote)}
          placeholder="Add note..."
          className={`mt-auto w-full bg-transparent border-none resize-none text-xs focus:ring-0 p-0 h-12 scrollbar-hide ${inputClass}`}
        />
      )}

      {!isPrintMode && localNote && (
        <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Save size={10} className={isAway ? 'text-white' : 'text-mariners-teal'} />
        </div>
      )}
    </div>
  );
}
