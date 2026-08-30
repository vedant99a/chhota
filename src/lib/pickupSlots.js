// Pickup slots are 15-minute intervals starting 15 minutes from now.
//
// PRD.md assumed the canteen closed at 21:00. It does not — Chhota is open
// 24 hours, so there is no closing time to count toward. Instead the picker
// offers a rolling window: nobody pre-orders a canteen lunch eight hours out,
// and an unbounded list would be a dropdown with hundreds of entries.
//
// Change WINDOW_HOURS to offer more or less. Slots roll over midnight
// correctly, so 23:45 is followed by 00:00.
const SLOT_MINUTES = 15;
const WINDOW_HOURS = 4;

function twoDigits(value) {
  return String(value).padStart(2, '0');
}

// Returns ['16:15', '16:30', ...].
export function generatePickupSlots(now = new Date()) {
  const slots = [];

  // Nothing sooner than 15 minutes from now.
  const earliest = new Date(now.getTime() + SLOT_MINUTES * 60 * 1000);
  const latest = new Date(now.getTime() + WINDOW_HOURS * 60 * 60 * 1000);

  // Start at the next quarter-hour boundary.
  const cursor = new Date(now);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(Math.ceil(cursor.getMinutes() / SLOT_MINUTES) * SLOT_MINUTES);

  while (cursor <= latest) {
    if (cursor >= earliest) {
      slots.push(`${twoDigits(cursor.getHours())}:${twoDigits(cursor.getMinutes())}`);
    }
    cursor.setMinutes(cursor.getMinutes() + SLOT_MINUTES);
  }

  return slots;
}
