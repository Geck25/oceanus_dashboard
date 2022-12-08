interface measureInfo {
    fullName: string;
    unitOfMeasurement: string;
    isCompass?: boolean;
    compassType?: string;
}

export const measures: Record<string, measureInfo> = {
    aws: {fullName: 'Apparent Wind Speed', unitOfMeasurement: 'kt'},
    awa: {fullName: 'Apparent Wind Angle', unitOfMeasurement: '°', isCompass: true, compassType: 'non-regular'},
    sow: {fullName: 'Speed Over Water', unitOfMeasurement: 'kt'},
    mh: {fullName: 'Magnetic Heading', unitOfMeasurement: '°', isCompass: true, compassType: 'regular'},
    cog: {fullName: 'Course Over Ground', unitOfMeasurement: '°'},
    sog: {fullName: 'Speed Over Ground', unitOfMeasurement: 'kt'},
    delta_vmg: {fullName: 'Delta VMG', unitOfMeasurement: 'kt'},
    delta_twa: {fullName: 'Delta Angle', unitOfMeasurement: '°'},
    delta_vpp: {fullName: 'Delta VPP', unitOfMeasurement: 'kt'},
    vmg: {fullName: 'Vmg', unitOfMeasurement: 'kt'},
    tws: {fullName: 'True Wind Speed', unitOfMeasurement: 'kt'},
    twa: {fullName: 'True Wind Angle', unitOfMeasurement: '°'},
    lat: {fullName: 'Latitude', unitOfMeasurement: '°'},
    lon: {fullName: 'Longitude', unitOfMeasurement: '°'}
}