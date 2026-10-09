const { DELIVERY_TRANSITIONS, DELIVERY_STATUS } = require('./constants');
const ApiError = require('./ApiError');

/** Returns all statuses reachable from the given status. */
function nextStatuses(status) {
  return DELIVERY_TRANSITIONS[status] || [];
}

/** True when moving from `from` to `to` is an allowed lifecycle step. */
function canTransition(from, to) {
  if (from === to) return false;
  return nextStatuses(from).includes(to);
}

/**
 * Throws a 409 when a transition is not allowed. This is the guard that keeps
 * deliveries moving through the lifecycle in a sensible order.
 */
function assertTransition(from, to) {
  if (!canTransition(from, to)) {
    throw ApiError.conflict(
      `Invalid status transition from ${from} to ${to}`,
      { allowed: nextStatuses(from) }
    );
  }
}

module.exports = { nextStatuses, canTransition, assertTransition, DELIVERY_STATUS };
