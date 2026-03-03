import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Printer, Save, Calendar as CalendarIcon, FileText, X } from 'lucide-react';
import { SCHEDULE_DATA, Game } from './constants';

const MONTHS = [
  { name: 'March / April', year: 2026, startMonth: 2, endMonth: 3 },
  { name: 'May', year: 2026, startMonth: 4, endMonth: 4 },
  { name: 'June', year: 2026, startMonth: 5, endMonth: 5 },
  { name: 'July', year: 2026, startMonth: 6, endMonth: 6 },
  { name: 'August', year: 2026, startMonth: 7, endMonth: 7 },
  { name: 'September', year: 2026, startMonth: 8, endMonth: 8 },
];

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function App() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showPrintWarning, setShowPrintWarning] = useState(false);
  const [showHomeOnly, setShowHomeOnly] = useState(false);

  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(err => console.error("Failed to fetch notes", err));
  }, []);

  const saveNote = async (id: string, content: string) => {
    setIsSaving(true);
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, content }),
      });
      setNotes(prev => ({ ...prev, [id]: content }));
    } catch (err) {
      console.error("Failed to save note", err);
    } finally {
      setIsSaving(false);
    }
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
      setCurrentMonthIdx(currentMonthIdx + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonthIdx > 0) {
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
          {isSaving && <span className="text-xs text-mariners-silver animate-pulse">Saving...</span>}
        </div>
      </header>

      {/* Main Content / Film Strip */}
      <main className="flex-1 relative overflow-hidden bg-zinc-950 no-print">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMonthIdx}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="h-full w-full p-4 md:p-8"
          >
            <MonthCalendar
              monthInfo={MONTHS[currentMonthIdx]}
              notes={notes}
              onSaveNote={saveNote}
              showHomeOnly={showHomeOnly}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute inset-y-0 left-0 flex items-center p-4">
          <button
            onClick={prevMonth}
            disabled={currentMonthIdx === 0}
            className="p-3 rounded-full bg-mariners-navy/80 border border-mariners-teal/30 hover:bg-mariners-teal transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={32} />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center p-4">
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
      <div className="print-only p-8 bg-white text-black">
        <h1 className="text-4xl font-bold mb-8 text-center uppercase italic border-b-4 border-black pb-4">
          Seattle Mariners 2026 Schedule & Notes
        </h1>
        {MONTHS.map((month, idx) => (
          <div key={idx} className="month-page mb-12">
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

function MonthCalendar({
  monthInfo,
  notes,
  onSaveNote,
  isPrintMode = false,
  showHomeOnly = false
}: {
  monthInfo: any,
  notes: { [key: string]: string },
  onSaveNote: (id: string, content: string) => void,
  isPrintMode?: boolean,
  showHomeOnly?: boolean
}) {
  const { name, year, startMonth, endMonth } = monthInfo;

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
  const padding = Array(firstDayOfWeek).fill(null);

  return (
    <div className={`h-full flex flex-col ${isPrintMode ? 'text-black' : 'text-white'}`}>
      <div className="mb-6 flex items-baseline gap-4">
        <h2 className={`text-6xl font-black uppercase italic tracking-tighter ${isPrintMode ? 'text-black' : 'text-mariners-teal'}`}>
          {name}
        </h2>
        <span className={`text-2xl font-light ${isPrintMode ? 'text-gray-500' : 'text-mariners-silver'}`}>{year}</span>
      </div>

      <div className="grid grid-cols-7 gap-px bg-mariners-teal/20 border border-mariners-teal/20 rounded-xl overflow-hidden flex-1">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className={`p-2 text-center text-xs font-bold tracking-widest ${isPrintMode ? 'bg-gray-100 text-black' : 'bg-mariners-navy text-mariners-silver'}`}>
            {day}
          </div>
        ))}

        {padding.map((_, i) => (
          <div key={`pad-${i}`} className={`${isPrintMode ? 'bg-white' : 'bg-mariners-navy/20'}`} />
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
      </div>
    </div>
  );
}

function DayCell({
  date,
  game,
  note,
  onSaveNote,
  isPrintMode
}: {
  date: Date,
  game?: Game,
  note: string,
  onSaveNote: (content: string) => void,
  isPrintMode: boolean
}) {
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
      bgClass = 'bg-mariners-navy text-white border-mariners-navy';
      textClass = 'text-white';
      timeClass = 'text-gray-300';
      badgeClass = 'bg-white/20 text-white';
    } else if (isAway) {
      bgClass = 'bg-[#506464] text-white border-[#506464]';
      textClass = 'text-white';
      timeClass = 'text-white/70';
      badgeClass = 'bg-white/20 text-white';
    } else {
      bgClass = 'bg-white text-black border-gray-200';
      textClass = 'text-black';
    }
  } else {
    if (isHome) {
      bgClass = 'bg-mariners-navy border-mariners-teal/30';
      textClass = 'text-white';
      timeClass = 'text-mariners-silver';
      badgeClass = 'bg-mariners-teal text-white';
      inputClass = 'text-white placeholder:text-white/30';
    } else if (isAway) {
      bgClass = 'bg-[#506464] border-[#506464]';
      textClass = 'text-white';
      timeClass = 'text-white/70';
      badgeClass = 'bg-mariners-navy text-white';
      inputClass = 'text-white placeholder:text-white/40';
    } else {
      bgClass = 'bg-mariners-navy/40 hover:bg-mariners-navy/60 border-transparent';
      textClass = 'text-white';
      inputClass = 'text-mariners-silver placeholder:text-mariners-silver/20';
    }
  }

  return (
    <div className={`group relative flex flex-col min-h-[120px] p-2 border transition-colors ${bgClass} ${isToday && !isPrintMode ? 'ring-2 ring-mariners-teal ring-inset' : ''}`}>
      <div className="flex justify-between items-start mb-1">
        <span className={`text-lg font-bold ${isToday && !isPrintMode ? 'text-mariners-teal' : textClass}`}>
          {day}
        </span>
        {game && (
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${badgeClass}`}>
            {game.isHome ? 'vs ' : '@ '}{game.opponent}
          </span>
        )}
      </div>

      {game && (
        <div className="mb-2">
          <div className={`text-[10px] font-bold uppercase tracking-tight ${timeClass}`}>
            {game.time}
          </div>
        </div>
      )}

      {isPrintMode ? (
        <div className={`text-xs italic whitespace-pre-wrap mt-auto ${isHome ? 'text-gray-300' : 'text-gray-700'}`}>
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
