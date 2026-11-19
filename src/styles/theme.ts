/** Design tokens mirrored from the CSS theme for use in JavaScript/Three.js. */
export const theme = {
  background: '#03040A',
  backgroundSecondary: '#080B14',
  panel: '#0D1220',
  text: '#F4F7FF',
  textMuted: '#929CB1',
  blue: '#5299FF',
  cyan: '#51E4F2',
  violet: '#9B82FF',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.16)',
} as const;

export type ThemeColor = keyof typeof theme;
