export function convertMinutesStringToHour(minutesString: number){
    const hour = Math.floor(minutesString / 60)
    const minutes = minutesString % 60;

    return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}