// Pickup slots are 15-minute intervals from now until closing.
// PRD.md: slots less than 15 minutes out are not offered, and there are no
// capacity limits, so this is pure date arithmetic with no Firestore involved.
const SLOT_MINUTES = 15;
const CLOSING_HOUR = 21;

function twoDigits(value) {
  return String(value).padStart(2, '0');
}

// Returns ['16:15', '16:30', ...]. Empty once the canteen is closed, or once
// every remaining slot is inside the 15-minute cutoff.
export function generatePickupSlots(now = new Date()) {
  const slots = [];

  // Nothing sooner than 15 minutes from now.
  const earliest = new Date(now.getTime() + SLOT_MINUTES * 60 * 1000);

  // Start at the next quarter-hour boundary.
  const cursor = new Date(now);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(Math.ceil(cursor.getMinutes() / SLOT_MINUTES) * SLOT_MINUTES);

  const closing = new Date(now);
  closing.setHours(CLOSING_HOUR, 0, 0, 0);

  while (cursor <= closing) {
    if (cursor >= earliest) {
      slots.push(`${twoDigits(cursor.getHours())}:${twoDigits(cursor.getMinutes())}`);
    }
    cursor.setMinutes(cursor.getMinutes() + SLOT_MINUTES);
  }

  return slots;
}
