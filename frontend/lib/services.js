import { Bike, Package, ShoppingBasket, UtensilsCrossed } from 'lucide-react';

/**
 * Frontend-only service catalogue. The backend has no `category` column yet, so
 * `category` is sent along for context but is not persisted — see BookingFlow.
 */
export const SERVICES = {
  food: {
    key: 'food',
    label: 'Food',
    blurb: 'Restaurant meals and takeaway',
    Icon: UtensilsCrossed,
    defaultSize: 'MEDIUM',
    descriptionPlaceholder: 'e.g. 2 large pizzas and a salad',
    accent: 'coral',
  },
  groceries: {
    key: 'groceries',
    label: 'Groceries',
    blurb: 'Supermarket and fresh produce',
    Icon: ShoppingBasket,
    defaultSize: 'LARGE',
    descriptionPlaceholder: 'e.g. 3 bags of groceries and a crate of eggs',
    accent: 'solar',
  },
  packages: {
    key: 'packages',
    label: 'Packages',
    blurb: 'Parcels and documents',
    Icon: Package,
    defaultSize: 'SMALL',
    descriptionPlaceholder: 'e.g. A4 envelope with signed documents',
    accent: 'violet',
  },
  courier: {
    key: 'courier',
    label: 'Courier',
    blurb: 'On-demand errands and pickups',
    Icon: Bike,
    defaultSize: 'SMALL',
    descriptionPlaceholder: 'e.g. Pick up a spare key and drop it off',
    accent: 'brand',
  },
};

export const SERVICE_LIST = Object.values(SERVICES);

export const PACKAGE_SIZES = [
  { value: 'SMALL', label: 'Small', hint: 'Documents, keys, small boxes' },
  { value: 'MEDIUM', label: 'Medium', hint: 'A few bags or a medium box' },
  { value: 'LARGE', label: 'Large', hint: 'Bulky items or multiple bags' },
];

export function getService(key) {
  return SERVICES[key] || null;
}
