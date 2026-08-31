// The status machine from PRD.md section 5. Forward only, no skipping.
//
//   placed -> preparing -> ready -> collected
//
// 'cancelled' is a terminal state reachable from placed or preparing. Nothing
// in the app moves an order there yet, but the model and the indicator know
// about it so the screens do not break if a document has that status.
export const STATUS_FLOW = ['placed', 'preparing', 'ready', 'collected'];

export const STATUS_LABEL = {
  placed: 'Placed',
  preparing: 'Preparing',
  ready: 'Ready',
  collected: 'Collected',
  cancelled: 'Cancelled',
};

// design.md: ready green appears in exactly one place in the whole app.
// This is that place.
export const STATUS_DOT = {
  placed: 'bg-muted',
  preparing: 'bg-accent',
  ready: 'bg-ready',
  collected: 'bg-muted',
  cancelled: 'bg-danger',
};

// The one step the vendor is allowed to take next, or null at the end.
export function nextStatus(status) {
  const index = STATUS_FLOW.indexOf(status);
  if (index === -1 || index === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[index + 1];
}

// Cancelling is only allowed before the food is ready. Once it is sitting on
// the counter, the vendor has already spent the ingredients.
export function canCancel(status) {
  return status === 'placed' || status === 'preparing';
}

// An order is open until it is collected or cancelled. Open orders are the
// ones on the vendor queue.
export function isOpen(status) {
  return status === 'placed' || status === 'preparing' || status === 'ready';
}

// How many of the four progress bars are filled.
export function stepsCompleted(status) {
  const index = STATUS_FLOW.indexOf(status);
  return index === -1 ? 0 : index + 1;
}
