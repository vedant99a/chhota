// The four categories from PRD.md section 3. Stored lowercase on the document,
// shown sentence case. Kept here so the manager and the student menu agree.
export const CATEGORIES = [
  { value: 'snacks', label: 'Snacks' },
  { value: 'meals', label: 'Meals' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'desserts', label: 'Desserts' },
];

export function categoryLabel(value) {
  const found = CATEGORIES.find((category) => category.value === value);
  return found ? found.label : value;
}

// Returns [{ value, label, items }] in CATEGORIES order, skipping empty
// categories. Items inside a category are sorted by name.
// Grouping happens here rather than in the Firestore query on purpose: a
// where + orderBy query needs a composite index, and this list is small.
export function groupByCategory(items) {
  return CATEGORIES.map((category) => ({
    ...category,
    items: items
      .filter((item) => item.category === category.value)
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((category) => category.items.length > 0);
}
