// Natural sort utilities for class strings like '10A', '11A1', '12', '10B2'
export function parseClass(cls: string) {
  if (!cls) return { grade: Infinity, letters: '', trailing: 0 };
  const trimmed = String(cls).trim();
  const m = trimmed.match(/^(\d+)/);
  const grade = m ? parseInt(m[1], 10) : Infinity;
  const rest = m ? trimmed.slice(m[1].length) : trimmed;
  // split rest into leading letters and trailing number (e.g., 'A1' => ['A', '1'])
  const r = rest.match(/^([A-Za-z]+)?(\d+)?/);
  const letters = (r && r[1]) ? r[1] : '';
  const trailing = (r && r[2]) ? parseInt(r[2], 10) : 0;
  return { grade, letters: letters.toUpperCase(), trailing };
}

export function compareClassStrings(a: string, b: string) {
  const A = parseClass(a);
  const B = parseClass(b);
  if (A.grade !== B.grade) return A.grade - B.grade;
  // compare letters
  if (A.letters !== B.letters) return A.letters.localeCompare(B.letters);
  // compare trailing numbers
  return (A.trailing || 0) - (B.trailing || 0);
}

export function sortClassStrings(arr: string[]) {
  return arr.slice().sort(compareClassStrings);
}

export function sortClassObjects<T extends { class: string; section?: string }>(arr: T[]) {
  return arr.slice().sort((x, y) => {
    const c = compareClassStrings(x.class, y.class);
    if (c !== 0) return c;
    // both have same class number, compare section similarly
    const secA = x.section || '';
    const secB = y.section || '';
    // Use same parsing for section (letters + trailing digits)
    const a = parseClass(secA);
    const b = parseClass(secB);
    if (a.letters !== b.letters) return a.letters.localeCompare(b.letters);
    return (a.trailing || 0) - (b.trailing || 0);
  });
}
