/**
 * Booking `date` (YYYY-MM-DD) and `startTime` (HH:mm) are interpreted as wall time in Asia/Karachi.
 */

const KARACHI = 'Asia/Karachi'

/** UTC instant when the appointment starts in Karachi. */
export function appointmentStartUtcMs(dateStr: string, startTime: string): number {
  const [y, mo, d] = dateStr.split('-').map(Number)
  const [h, mi, secRaw] = startTime.split(':').map(Number)
  const sec = Number.isFinite(secRaw) ? secRaw : 0
  let ms = Date.UTC(y, mo - 1, d, h - 5, mi, sec)
  for (let i = 0; i < 12; i++) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: KARACHI,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date(ms))
    const pick = (t: string) => Number(parts.find((p) => p.type === t)?.value)
    const wy = pick('year')
    const wm = pick('month')
    const wd = pick('day')
    const wh = pick('hour')
    const wmi = pick('minute')
    const ws = pick('second')
    if (wy === y && wm === mo && wd === d && wh === h && wmi === mi && ws === sec) {
      return ms
    }
    const dayDiff = (Date.UTC(y, mo - 1, d) - Date.UTC(wy, wm - 1, wd)) / 86400000
    ms += dayDiff * 86400000 + (h - wh) * 3600000 + (mi - wmi) * 60000 + (sec - ws) * 1000
  }
  return ms
}

/**
 * True when `now` is within the send window after the reminder trigger instant.
 * Trigger = appointment start minus `reminderMinutes`.
 */
export function isReminderDue(
  dateStr: string,
  startTime: string,
  reminderMinutes: number,
  nowMs: number,
  windowMs: number
): boolean {
  const startMs = appointmentStartUtcMs(dateStr, startTime)
  const triggerMs = startMs - reminderMinutes * 60_000
  const delta = nowMs - triggerMs
  return delta >= 0 && delta <= windowMs
}
