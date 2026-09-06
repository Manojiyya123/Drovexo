export const RATE_PER_KM = 10; // ₹10 per km
export const RIDER_SHARE = 0.8;
export const PLATFORM_SHARE = 0.2;

export function calculatePrice(distanceKm) {
    return distanceKm * RATE_PER_KM;
}

export function calculateRiderEarning(totalAmount) {
    return totalAmount * RIDER_SHARE;
}

export function calculatePlatformEarning(totalAmount) {
    return totalAmount * PLATFORM_SHARE;
}
