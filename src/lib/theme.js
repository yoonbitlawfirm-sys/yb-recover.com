export function getThemeStyle(site = {}) {
  const c = site.colors || {};
  const values = {
    '--yb-bg': c.bg || '#02050b',
    '--yb-bg-deep': c.bgDeep || '#010308',
    '--yb-bg-mid': c.bgMid || '#07101d',
    '--yb-surface': c.surface || '#0a101b',
    '--yb-surface-strong': c.surfaceStrong || '#101827',
    '--yb-accent': c.accent || '#a91f2c',
    '--yb-accent-strong': c.accentStrong || '#7d1420',
    '--yb-accent-2': c.accent2 || '#d6b36b',
    '--yb-accent-soft': c.accentSoft || 'rgba(169, 31, 44, 0.20)',
    '--yb-accent-glow': c.accentGlow || 'rgba(169, 31, 44, 0.34)',
    '--yb-secondary-soft': c.secondarySoft || 'rgba(214, 179, 107, 0.16)',
    '--yb-line': c.line || 'rgba(214, 179, 107, 0.22)',
    '--yb-text': c.text || '#f7f8fb',
    '--yb-muted': c.muted || '#aeb5c2',
    '--yb-on-accent': c.onAccent || '#ffffff'
  };

  return Object.entries(values)
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
}
