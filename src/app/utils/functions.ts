export function distanceBetweenTwoPoints(lat1: number, lon1: number, lat2: number, lon2: number): number {
    let dlambda, dphi, dpsi, q, d;
    const radius = 6387332.5;
    dlambda = (lon2 - lon1) * Math.PI / 180.0;
    dphi = (lat2 - lat1) * Math.PI / 180.0;
    dpsi = Math.log(Math.tan((0.25 + lat2 / 360.0) * Math.PI) / Math.tan((0.25 + lat1 / 360.0) * Math.PI));

    if (Math.abs(dpsi) > 1.0e-10) {
        q = dphi / dpsi;
    } else {
        q = Math.cos(lat1 * Math.PI / 180.0);
    }

    d = Math.sqrt(dphi * dphi + q * q * dlambda * dlambda) * radius;
    return d;
}

export function bearingBetweenTwoPoints(lat1: number, lon1: number, lat2: number, lon2: number): number {
    let dlambda, dpsi, bearing;
    dlambda = (lon2 - lon1) * Math.PI / 180.0;
    dpsi = Math.log(Math.tan((0.25 + lat2 / 360.0) * Math.PI) / Math.tan((0.25 + lat1 / 360.0) * Math.PI));
    bearing = 180.0 / Math.PI * Math.atan2(dlambda, dpsi);

    if (bearing < 0.0) {
        bearing = 360.0 + bearing;
    }

    return bearing;
}