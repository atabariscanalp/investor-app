import { RequestTimeZone } from "../types/types"

const getDayOfWeek = (date: string, requestTimeZone: RequestTimeZone) => {
	const dateUTC = convertDateToUTC(date, requestTimeZone)
	const day = dateUTC.getDay()
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

	return days[day]
}

const convertDateToUTC = (dateStr: string, requestTimeZone: RequestTimeZone): Date => {
	const [date, hour] = dateStr.split(" ")
	const [part1, part2, year] = date.split("/").map(Number)

	let day: number, month: number
	if (requestTimeZone === RequestTimeZone.US_PST || requestTimeZone === RequestTimeZone.US_EST) {
		month = part1 - 1
		day = part2
	} else {
		day = part1
		month = part2 - 1
	}

	if (hour) {
		const [hours, minutes] = hour.split(":").map(Number)
		return new Date(Date.UTC(year, month, day, hours, minutes))
	}
	
	return new Date(Date.UTC(year, month, day))
}

export { getDayOfWeek, convertDateToUTC }