// Nairobi (EAT, UTC+3) never observes daylight saving, so a fixed offset
// is correct year-round — no timezone database needed.

export function getNairobiParts(date = new Date()) {
  const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
  const nairobi = new Date(utcMs + 3 * 60 * 60000);
  return {
    hours: nairobi.getHours(),
    minutes: nairobi.getMinutes(),
    date: nairobi,
  };
}

export function formatNairobiTime(date = new Date()) {
  const { hours, minutes } = getNairobiParts(date);
  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export function isProbablyAsleep(date = new Date()) {
  const { hours } = getNairobiParts(date);
  return hours >= 1 && hours < 6;
}
