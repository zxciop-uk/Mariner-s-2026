import fs from 'fs';

const text = `
Mar 26
Thu
Mariners Home Opener
vs.  Guardians	
7:10 pm PDT
Opening Day - Magnetic Schedule Giveaway
_____________
Mar 27
Fri
vs.  Guardians	
6:45 pm PDT
AL West Champs Replica Banner Night
_____________
Mar 28
Sat
vs.  Guardians	
6:40 pm PDT
Cal Raleigh "60 Home Run" Bobblehead Night
_____________
Mar 29
Sun
vs.  Guardians	
4:20 pm PDT
__
_____________
Mar 30
Mon
vs.  Yankees	
6:40 pm PDT
_____________
Mar 31
Tue
vs.  Yankees	
6:40 pm PDT

_____________
Apr 1
Wed
vs.  Yankees	
1:10 pm PDT
_____________
Apr 10
Fri
vs.  Astros	
6:40 pm PDT
Ichiro Replica Statue Night
_____________
Apr 11
Sat
vs.  Astros	
6:40 pm PDT
Humpy Shoulder Plush Night
_____________
Apr 12
Sun
vs.  Astros	
1:10 pm PDT
_____________
Apr 13
Mon
vs.  Astros	
1:10 pm PDT
Mariners Value Game
_____________
Apr 17
Fri
vs.  Rangers	
6:40 pm PDT
Kingdome Fanny Pack Hat Night
_____________
Apr 18
Sat
vs.  Rangers	
4:15 pm PDT
Cal Raleigh '70s Jersey Night
_____________
Apr 19
Sun
vs.  Rangers	
1:10 pm PDT
'70s Pin Day
_____________
Apr 20
Mon
vs.  Athletics	
6:40 pm PDT
Mariners Value Game
_____________
Apr 21
Tue
vs.  Athletics	
6:40 pm PDT
Mariners Value Game
_____________
Apr 22
Wed
vs.  Athletics	
1:10 pm PDT
Mariners Value Game
_____________
May 1
Fri
vs.  Royals	
6:45 pm PDT
Randy Johnson '80s Jersey Night
_____________
May 2
Sat
vs.  Royals	
6:40 pm PDT
Randy Johnson Number Retirement Ceremony Night
_____________
May 3
Sun
vs.  Royals	
1:10 pm PDT
'80s Pin Day
_____________
May 4
Mon
vs.  Braves	
6:40 pm PDT
Star Wars Night
_____________
May 5
Tue
vs.  Braves	
6:40 pm PDT
Mariners Value Game
_____________
May 6
Wed
vs.  Braves	
1:10 pm PDT
Mariners Value Game
_____________
May 15
Fri
vs.  Padres	
6:40 pm PDT
Hello Kitty® Clear Crossbody Bag Night
_____________
May 16
Sat
vs.  Padres	
4:15 pm PDT
Salute to Armed Forces Night - Military Cap Giveaway
_____________
May 17
Sun
vs.  Padres	
4:20 pm PDT
__
_____________
May 18
Mon
vs.  White Sox	
6:40 pm PDT
Josh Naylor Bobblehead 2-Day Giveaway
_____________
May 19
Tue
vs.  White Sox	
6:40 pm PDT
Josh Naylor Bobblehead 2-Day Giveaway
_____________
May 20
Wed
vs.  White Sox	
1:10 pm PDT
Mariners Value Game
_____________
May 29
Fri
vs.  D-backs	
7:10 pm PDT
Fireworks Night
_____________
May 30
Sat
vs.  D-backs	
7:10 pm PDT
Julio Rodríguez '90s Jersey Night
_____________
May 31
Sun
vs.  D-backs	
1:10 pm PDT
'90s Pin Day
_____________
Jun 1
Mon
vs.  Mets	
6:40 pm PDT
_____________
Jun 2
Tue
Lou Gehrig Day
vs.  Mets	
6:40 pm PDT
_____________
Jun 3
Wed
vs.  Mets	
12:40 pm PDT
_____________
Jun 16
Tue
vs.  Orioles	
6:40 pm PDT
Mariners Value Game
_____________
Jun 17
Wed
vs.  Orioles	
6:40 pm PDT
Mariners Value Game
_____________
Jun 18
Thu
vs.  Orioles	
1:10 pm PDT
Stars & Stripes Soccer Jersey Day
_____________
Jun 19
Fri
vs.  Red Sox	
7:10 pm PDT
Fireworks Night
_____________
Jun 20
Sat
vs.  Red Sox	
7:10 pm PDT
_____________
Jun 21
Sun
vs.  Red Sox	
1:10 pm PDT
_____________
Jun 29
Mon
vs.  Angels	
6:40 pm PDT
Cal Raleigh POP! Collectible 3-Day Giveaway
_____________
Jun 30
Tue
vs.  Angels	
6:40 pm PDT
Cal Raleigh POP! Collectible 3-Day Giveaway
_____________
Jul 2
Thu
vs.  Angels	
6:40 pm PDT
Cal Raleigh POP! Collectible 3-Day Giveaway
_____________
Jul 3
Fri
vs.  Blue Jays	
7:10 pm PDT
Fireworks Night
_____________
Jul 4
Sat
vs.  Blue Jays	
1:10 pm PDT
Fourth of July - Patriotic Bucket Hat Giveaway
_____________
Jul 5
Sun
vs.  Blue Jays	
2:00 pm PDT
Kids Run the Bases
_____________
Jul 17
Fri
vs.  Giants	
7:10 pm PDT
Fireworks Night
_____________
Jul 18
Sat
vs.  Giants	
5:08 pm PDT
_____________
Jul 19
Sun
vs.  Giants	
1:10 pm PDT
'00s Pin Day
_____________
Jul 20
Mon
vs.  Reds	
6:40 pm PDT
Mariners Value Game
_____________
Jul 21
Tue
vs.  Reds	
6:40 pm PDT
Mariners Value Game
_____________
Jul 22
Wed
vs.  Reds	
12:40 pm PDT
_____________
Jul 31
Fri
vs.  Twins	
7:10 pm PDT
Fireworks Night
_____________
Aug 1
Sat
vs.  Twins	
1:10 pm PDT
Aloha Shirt Day
_____________
Aug 2
Sun
vs.  Twins	
1:10 pm PDT
Kids Run the Bases
_____________
Aug 4
Tue
vs.  Tigers	
6:40 pm PDT
Mariners Value Game
_____________
Aug 5
Wed
vs.  Tigers	
6:40 pm PDT
Mariners Value Game
_____________
Aug 6
Thu
vs.  Tigers	
1:10 pm PDT
_____________
Aug 7
Fri
vs.  Rays	
7:10 pm PDT
_____________
Aug 8
Sat
vs.  Rays	
6:50 pm PDT
50 Seasons Celebration Night
_____________
Aug 9
Sun
vs.  Rays	
1:10 pm PDT
50 Seasons Pin Day
_____________
Aug 21
Fri
vs.  Cubs	
7:10 pm PDT
Fireworks Night
_____________
Aug 22
Sat
vs.  Cubs	
6:40 pm PDT
_____________
Aug 23
Sun
vs.  Cubs	
1:10 pm PDT
'10s Pin Day
_____________
Aug 24
Mon
vs.  Phillies	
6:40 pm PDT
Native American Heritage Night
_____________
Aug 25
Tue
vs.  Phillies	
6:40 pm PDT
_____________
Aug 26
Wed
vs.  Phillies	
1:10 pm PDT
_____________
Sep 3
Thu
vs.  Athletics	
6:40 pm PDT
Mariners Value Game
_____________
Sep 4
Fri
vs.  Athletics	
7:10 pm PDT
Fan Appreciation Night
_____________
Sep 5
Sat
vs.  Athletics	
6:40 pm PDT
Bryan Woo Bobblehead Night
_____________
Sep 6
Sun
vs.  Athletics	
1:10 pm PDT
Kids Appreciation Day
_____________
Sep 8
Tue
vs.  Rangers	
6:40 pm PDT
Andrés Muñoz POP! Collectible 3-Day Giveaway
_____________
Sep 9
Wed
vs.  Rangers	
6:40 pm PDT
Andrés Muñoz POP! Collectible 3-Day Giveaway
_____________
Sep 10
Thu
vs.  Rangers	
1:10 pm PDT
Andrés Muñoz POP! Collectible 3-Day Giveaway
_____________
Sep 22
Tue
vs.  Astros	
6:40 pm PDT
Mariners Value Game
_____________
Sep 23
Wed
vs.  Astros	
7:10 pm PDT
Mariners Value Game
_____________
Sep 24
Thu
vs.  Angels	
6:40 pm PDT
Mariners Value Game
_____________
Sep 25
Fri
vs.  Angels	
7:10 pm PDT
Fireworks Night
_____________
Sep 26
Sat
vs.  Angels	
6:40 pm PDT
'20s Pin Night
_____________
Sep 27
Sun
vs.  Angels	
12:10 pm PDT
_____________
`;

const monthMap: Record<string, string> = {
  'Mar': '03',
  'Apr': '04',
  'May': '05',
  'Jun': '06',
  'Jul': '07',
  'Aug': '08',
  'Sep': '09'
};

const games = text.split('_____________').map(s => s.trim()).filter(s => s);

const parsedGames: Record<string, { time: string, promo: string }> = {};

games.forEach(g => {
  const lines = g.split('\n').map(l => l.trim()).filter(l => l && l !== '__' && !l.includes('__: FS1'));
  if (lines.length < 4) return;
  
  const dateParts = lines[0].split(' ');
  const month = monthMap[dateParts[0]];
  const day = dateParts[1].padStart(2, '0');
  const dateStr = `2026-${month}-${day}`;
  
  let timeLineIdx = lines.findIndex(l => l.includes('pm PDT') || l.includes('am PDT'));
  if (timeLineIdx === -1) return;
  
  const time = lines[timeLineIdx].replace(' pm PDT', '').replace(' am PDT', '');
  
  let promo = '';
  if (timeLineIdx < lines.length - 1) {
    promo = lines.slice(timeLineIdx + 1).join(' - ');
  }
  
  let vsLineIdx = lines.findIndex(l => l.startsWith('vs.'));
  if (vsLineIdx > 2) {
    const extraPromo = lines.slice(2, vsLineIdx).join(' - ');
    if (extraPromo && extraPromo !== 'Mariners Home Opener') {
      promo = promo ? extraPromo + ' - ' + promo : extraPromo;
    } else if (extraPromo === 'Mariners Home Opener') {
      promo = promo ? extraPromo + ' - ' + promo : extraPromo;
    }
  }

  parsedGames[dateStr] = { time, promo };
});

const constantsPath = './src/constants.ts';
let constantsContent = fs.readFileSync(constantsPath, 'utf-8');

// Add promotion field to Game interface if not exists
if (!constantsContent.includes('promotion?: string;')) {
  constantsContent = constantsContent.replace(
    'isHome?: boolean;',
    'isHome?: boolean;\n  promotion?: string;'
  );
}

// Update SCHEDULE_DATA
const updatedContent = constantsContent.replace(
  /\{ date: "([^"]+)", opponent: "([^"]+)", time: "([^"]+)"(?:, isHome: (true|false))? \}/g,
  (match, date, opponent, time, isHome) => {
    const parsed = parsedGames[date];
    if (parsed && isHome === 'true') {
      let replacement = `{ date: "${date}", opponent: "${opponent}", time: "${parsed.time}", isHome: true`;
      if (parsed.promo) {
        replacement += `, promotion: "${parsed.promo.replace(/"/g, '\\"')}"`;
      }
      replacement += ` }`;
      return replacement;
    }
    return match;
  }
);

fs.writeFileSync(constantsPath, updatedContent);
console.log('Updated constants.ts');
