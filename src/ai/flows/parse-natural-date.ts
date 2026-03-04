export async function parseNaturalDate({ dateText, currentDate } : any) {
  // Very small stub: try to parse ISO or common words
  const text = String(dateText || '').trim().toLowerCase();
  const today = new Date(currentDate + 'T00:00:00');
  if (text === 'today') return { isoDate: currentDate };
  if (text === 'tomorrow') {
    const d = new Date(today.getTime() + 24*60*60*1000);
    return { isoDate: d.toISOString().slice(0,10) };
  }
  // fallback: try Date.parse
  const parsed = Date.parse(text);
  if (!isNaN(parsed)) {
    const d = new Date(parsed);
    return { isoDate: d.toISOString().slice(0,10) };
  }
  // default to today
  return { isoDate: currentDate };
}

export default parseNaturalDate;
