/** New-monitor checkup results, kept in localStorage only. */
const KEY = 'display-test:checkup:v1';

export const RESULT_LABELS = {
  pass: 'Pass',
  minor: 'Minor issue',
  fail: 'Fail',
  skip: 'Skipped',
};

export function loadCheckup() {
  if (typeof localStorage === 'undefined') return { results: {}, notes: {}, startedAt: null };
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && typeof raw === 'object') return { results: {}, notes: {}, ...raw };
  } catch {
    // corrupted — start fresh
  }
  return { results: {}, notes: {}, startedAt: null };
}

export function saveCheckup(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage full or blocked
  }
  window.dispatchEvent(new Event('checkup-change'));
}

export function recordResult(slug, result, note) {
  const state = loadCheckup();
  state.startedAt = state.startedAt || new Date().toISOString();
  state.results[slug] = result;
  if (note !== undefined) state.notes[slug] = note;
  saveCheckup(state);
}

export function resetCheckup() {
  saveCheckup({ results: {}, notes: {}, startedAt: null, panel: null, displayInfo: null });
}
