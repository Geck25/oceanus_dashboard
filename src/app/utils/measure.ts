interface measureInfo {
    fullName: string;
    unitOfMeasurement: string;
}

export const measures: Record<string, measureInfo> = {
    aws: {fullName: 'Apparent Wind Speed', unitOfMeasurement: 'kn'},
    awa: {fullName: 'Apparent Wind Angle', unitOfMeasurement: '°'}
}