import scheduleData from '../schedule.json';

export interface Game {
  date: string; // YYYY-MM-DD
  opponent: string;
  time: string;
  isHome?: boolean;
  promotion?: string;
}

export const SCHEDULE_DATA: Game[] = scheduleData.map((game: any) => ({
  date: game.date,
  opponent: game.opponent,
  time: game.time.replace(' pm', '').replace(' am', ''),
  isHome: game.isHome,
  promotion: game.special || undefined
}));
