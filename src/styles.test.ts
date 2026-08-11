import styles from './styles.css?raw';

test('text-entry controls use a 16px mobile font without disabling viewport zoom', () => {
  const mobile = extractBlock(styles, '@media (max-width: 899px)');
  const outsideMobile = styles.slice(0, mobile.start) + styles.slice(mobile.end);
  const controls = /input:not\(\[type="checkbox"\]\):not\(\[type="radio"\]\),\s*select,\s*textarea\s*\{[^}]*font-size:\s*16px;/g;

  expect([...mobile.text.matchAll(controls)]).toHaveLength(1);
  expect([...outsideMobile.matchAll(controls)]).toHaveLength(0);
  expect(styles).not.toMatch(/(?:user-scalable\s*=\s*no|maximum-scale\s*=\s*1)/i);
});

test('Daily Moment controls stay tappable, contained, and still under reduced motion', () => {
  expect(styles).toMatch(/\.daily-moment[^\{]*\{[^}]*min-width:\s*0;[^}]*overflow-wrap:\s*anywhere;/);
  expect(styles).toMatch(/\.daily-moment[^\{]*button[^\{]*\{[^}]*min-height:\s*44px;/);
  expect(styles).toMatch(/\.moment-switch[^\{]*\{[^}]*min-width:\s*44px;[^}]*min-height:\s*44px;/);
  expect(styles).toMatch(/\.log-tabs button[^\{]*\{[^}]*min-height:\s*44px;/);
  expect(styles).toMatch(/\.moment-times[^\{]*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/);
  const reduced = extractBlock(styles, '@media (prefers-reduced-motion: reduce)');
  expect(reduced.text).toMatch(/animation-duration:\s*\.01ms\s*!important;/);
});

test('context ambience and workout-place cards keep one responsive visual layer', () => {
  expect(styles).toMatch(/:root\[data-dayphase="night"\]/);
  expect(styles).toMatch(/:root\[data-weather="rain"\]/);
  expect(styles).toMatch(/\.context-whisper[^{]*\{[^}]*border-radius:/);
  expect(styles).toMatch(/\.gym-arrival[^{]*\{[^}]*position:\s*fixed;/);
  expect(styles).toMatch(/\.gym-places[^{]*\{[^}]*border-radius:/);
  expect(styles).toMatch(/\.gym-place-form[^{]*\{[^}]*grid-template-columns:/);
});

function extractBlock(css: string, marker: string) {
  const start = css.indexOf(marker);
  const open = css.indexOf('{', start);
  let depth = 0;

  for (let index = open; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1;
    if (css[index] === '}' && --depth === 0) return { start, end: index + 1, text: css.slice(start, index + 1) };
  }

  throw new Error(`Unclosed CSS block: ${marker}`);
}
