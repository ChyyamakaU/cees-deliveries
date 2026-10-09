const { PRICING, PACKAGE_SIZE } = require('./constants');

const EARTH_RADIUS_KM = 6371;

const toRad = (deg) => (deg * Math.PI) / 180;

/**
 * Great-circle distance between two coordinates in kilometres.
 * Returns null when any coordinate is missing.
 */
function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  if ([lat1, lon1, lat2, lon2].some((v) => v === null || v === undefined || v === '')) {
    return null;
  }
  const dLat = toRad(Number(lat2) - Number(lat1));
  const dLon = toRad(Number(lon2) - Number(lon1));
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(Number(lat1))) * Math.cos(toRad(Number(lat2))) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;
  return Math.round(distance * 100) / 100;
}

/**
 * Delivery fee = (base + perKm * distance) * sizeMultiplier.
 */
function calculateFee({ distanceKm = 0, packageSize = PACKAGE_SIZE.SMALL }) {
  const multiplier = PRICING.sizeMultiplier[packageSize] || 1;
  const raw = (PRICING.baseFee + PRICING.perKmFee * Number(distanceKm || 0)) * multiplier;
  return Math.round(raw * 100) / 100;
}

/**
 * Resolves the distance for a payload: prefer explicit distanceKm, otherwise
 * derive it from coordinates.
 */
function resolveDistanceKm(payload = {}) {
  if (payload.distanceKm !== undefined && payload.distanceKm !== null && payload.distanceKm !== '') {
    return Number(payload.distanceKm);
  }
  const derived = haversineDistanceKm(
    payload.pickupLatitude,
    payload.pickupLongitude,
    payload.dropoffLatitude,
    payload.dropoffLongitude
  );
  return derived === null ? 0 : derived;
}

module.exports = { haversineDistanceKm, calculateFee, resolveDistanceKm, PRICING };
