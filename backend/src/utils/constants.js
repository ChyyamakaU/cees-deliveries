/**
 * Central place for every shared enum / business constant.
 * Keeping these together means models, migrations, validators and
 * services all agree on the exact same string values.
 */

const ROLES = Object.freeze({
  CUSTOMER: 'CUSTOMER',
  RIDER: 'RIDER',
  ADMIN: 'ADMIN',
});

const USER_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
});

const RIDER_AVAILABILITY = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  BUSY: 'BUSY',
  OFFLINE: 'OFFLINE',
});

const DELIVERY_STATUS = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  ASSIGNED: 'ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
});

const PAYMENT_METHOD = Object.freeze({
  CASH: 'CASH',
  CARD: 'CARD',
  TRANSFER: 'TRANSFER',
});

const PAYMENT_STATUS = Object.freeze({
  PENDING: 'PENDING',
  SUCCESSFUL: 'SUCCESSFUL',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
});

const PACKAGE_SIZE = Object.freeze({
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
});

const VEHICLE_TYPE = Object.freeze({
  BIKE: 'BIKE',
  CAR: 'CAR',
  VAN: 'VAN',
  TRUCK: 'TRUCK',
});

/**
 * Allowed delivery status transitions.
 * The key is the current status, the value is the list of statuses it may
 * move to. This single map is the source of truth for the lifecycle.
 */
const DELIVERY_TRANSITIONS = Object.freeze({
  [DELIVERY_STATUS.PENDING]: [DELIVERY_STATUS.CONFIRMED, DELIVERY_STATUS.CANCELLED],
  [DELIVERY_STATUS.CONFIRMED]: [
    DELIVERY_STATUS.ASSIGNED,
    DELIVERY_STATUS.PICKED_UP,
    DELIVERY_STATUS.CANCELLED,
  ],
  [DELIVERY_STATUS.ASSIGNED]: [
    DELIVERY_STATUS.PICKED_UP,
    DELIVERY_STATUS.CANCELLED,
  ],
  [DELIVERY_STATUS.PICKED_UP]: [DELIVERY_STATUS.IN_TRANSIT, DELIVERY_STATUS.CANCELLED],
  [DELIVERY_STATUS.IN_TRANSIT]: [DELIVERY_STATUS.DELIVERED, DELIVERY_STATUS.CANCELLED],
  [DELIVERY_STATUS.DELIVERED]: [],
  [DELIVERY_STATUS.CANCELLED]: [],
});

/** Statuses after which a delivery can no longer be cancelled. */
const NON_CANCELLABLE_STATUSES = [DELIVERY_STATUS.DELIVERED, DELIVERY_STATUS.CANCELLED];

/** Statuses a customer may still edit the details of. */
const EDITABLE_STATUSES = [DELIVERY_STATUS.PENDING, DELIVERY_STATUS.CONFIRMED];

/** Payment methods that must be settled before pickup. */
const PREPAID_METHODS = [PAYMENT_METHOD.CARD, PAYMENT_METHOD.TRANSFER];

const PRICING = Object.freeze({
  baseFee: Number(process.env.BASE_FEE) || 500,
  perKmFee: Number(process.env.PER_KM_FEE) || 120,
  currency: process.env.CURRENCY || 'NGN',
  sizeMultiplier: {
    [PACKAGE_SIZE.SMALL]: 1,
    [PACKAGE_SIZE.MEDIUM]: 1.25,
    [PACKAGE_SIZE.LARGE]: 1.6,
  },
});

module.exports = {
  ROLES,
  USER_STATUS,
  RIDER_AVAILABILITY,
  DELIVERY_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  PACKAGE_SIZE,
  VEHICLE_TYPE,
  DELIVERY_TRANSITIONS,
  NON_CANCELLABLE_STATUSES,
  EDITABLE_STATUSES,
  PREPAID_METHODS,
  PRICING,
};
