// backend/utils/geo.js

// Convert degrees → radians
function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// Haversine distance in **kilometers**
export function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Simple ETA estimate in minutes.
 * @param {number} distanceKm - distance in kilometers
 * @param {number} avgSpeedKmph - average ambulance speed (default 40 km/h)
 * @returns {number} ETA in minutes (rounded)
 */
export function estimateEtaMinutes(distanceKm, avgSpeedKmph = 40) {
  if (!distanceKm || distanceKm <= 0) return 0;
  if (!avgSpeedKmph || avgSpeedKmph <= 0) avgSpeedKmph = 40;

  const hours = distanceKm / avgSpeedKmph;
  const minutes = hours * 60;
  return Math.round(minutes);
}
