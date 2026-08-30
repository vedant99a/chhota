import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

// The cart lives here, in React state, and never touches Firestore. Nothing is
// written to the database until the student presses "Place order", at which
// point the whole cart is copied into one order document.
//
// It is deliberately in memory only: a reload empties the cart. Persisting it
// would mean either localStorage or a Firestore draft, and neither is worth
// the complexity for a canteen order placed in under a minute.
export function CartProvider({ children }) {
  const [lines, setLines] = useState([]);

  const addItem = useCallback((menuItem) => {
    setLines((current) => {
      const existing = current.find((line) => line.menuItemId === menuItem.id);
      if (existing) {
        return current.map((line) =>
          line.menuItemId === menuItem.id ? { ...line, qty: line.qty + 1 } : line
        );
      }
      // Name and price are captured now and carried into the order, so a
      // later price change on the menu does not alter this cart.
      return [
        ...current,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          vendorId: menuItem.vendorId,
          qty: 1,
        },
      ];
    });
  }, []);

  const setQty = useCallback((menuItemId, qty) => {
    setLines((current) =>
      qty <= 0
        ? current.filter((line) => line.menuItemId !== menuItemId)
        : current.map((line) => (line.menuItemId === menuItemId ? { ...line, qty } : line))
    );
  }, []);

  const removeItem = useCallback((menuItemId) => {
    setLines((current) => current.filter((line) => line.menuItemId !== menuItemId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((sum, line) => sum + line.qty, 0), [lines]);
  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.price * line.qty, 0),
    [lines]
  );

  const value = { lines, addItem, setQty, removeItem, clear, count, total };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return context;
}
