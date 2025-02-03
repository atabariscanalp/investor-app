import { BUSINESS_HOURS, TOS_CUTOFF_DATE } from "../lib/constants"
import { RequestTimeZone, RequestType } from "../types/types"
import { convertDateToUTC } from "./date.util"

const checkIfRequestIsNewTOS = (signupDate: string, requestTimeZone: RequestTimeZone) => {
	const signupDateUTC = convertDateToUTC(signupDate, requestTimeZone)
	
	return signupDateUTC.getTime() > TOS_CUTOFF_DATE.getTime()
}

const getApprovalTimeLimit = (requestType: RequestType, requestTimeZone: RequestTimeZone, isNewApproval: boolean, investmentDateStr: string) => {
	const investmentDateUTC = convertDateToUTC(investmentDateStr, requestTimeZone)
	let timeToAdd = 0

	switch (requestType) {
		case RequestType.PHONE:
			// add 24 hours for new tos, 4 hours for old tos
			timeToAdd = isNewApproval ? 1000 * 60 * 60 * 24 : 1000 * 60 * 60 * 4
			break
		case RequestType.WEB_APP:
			// add 16 hours for new tos, 8 hours for old tos
			timeToAdd = isNewApproval ? 1000 * 60 * 60 * 16 : 1000 * 60 * 60 * 8
			break
		default:
			throw new Error("Invalid request type")
	}

	return new Date(investmentDateUTC.getTime() + timeToAdd)
}

const getRefundDeadlineDate = (signupDateStr: string, investmentDateStr: string, requestTimeZone: RequestTimeZone, requestType: RequestType) => {
	const isNewTOS = checkIfRequestIsNewTOS(signupDateStr, requestTimeZone)

	return getApprovalTimeLimit(requestType, requestTimeZone, isNewTOS, investmentDateStr).toUTCString()
}

const getBusinessHours = (requestTimeZone: RequestTimeZone) => {
	const start = BUSINESS_HOURS.start
	const end = BUSINESS_HOURS.end

	switch (requestTimeZone) {
			case RequestTimeZone.EUROPE_GMT:
					return {
						start: start,
						end: end
					}
			case RequestTimeZone.EUROPE_CET:
					return {
						start: start + 1,
						end: end + 1
					}
			case RequestTimeZone.US_EST:
					return {
						start: start - 5,
						end: end - 5
					}
			case RequestTimeZone.US_PST:
					return {
						start: start - 8,
						end: end - 8
					}
			default:
					return {
						start: start,
						end: end
					}
	}
}

const getRequestRegistrationDate = (requestType: RequestType, requestTimeZone: RequestTimeZone, refundRequestDateStr: string) => {
	const refundRequestDateUTC = convertDateToUTC(refundRequestDateStr, requestTimeZone)
	
	// if request is made from WEB just return it
	if (requestType === RequestType.WEB_APP) {
		return refundRequestDateUTC
	}

	const businessHours = getBusinessHours(requestTimeZone)
	
	const refundRequestDay = refundRequestDateUTC.getDay()
	const isWeekend = refundRequestDay === 0 || refundRequestDay === 6

	const isWithinBusinessHours = refundRequestDateUTC.getHours() >= businessHours.start && refundRequestDateUTC.getHours() <= businessHours.end && !isWeekend
	if (isWithinBusinessHours) {
		return refundRequestDateUTC
	}

	const nextBusinessDay = new Date(refundRequestDateUTC)
	
	if (isWeekend) {
		// if sunday add 1 day, otherwise add 2 days
		const daysToAdd = refundRequestDay === 0 ? 1 : 2
		nextBusinessDay.setDate(nextBusinessDay.getDate() + daysToAdd)
	} else {
		nextBusinessDay.setDate(nextBusinessDay.getDate() + 1)
	}

	nextBusinessDay.setHours(businessHours.start, 0, 0)

	return nextBusinessDay
}

const checkIfRequestApproved = (
	requestTimeZone: RequestTimeZone,
	requestType: RequestType,
	signupDateString: string,
	investmentDateString: string,
	refundRequestDateString: string,
) => {
	const isNewTOS = checkIfRequestIsNewTOS(signupDateString, requestTimeZone)
	const approvalTimeLimit = getApprovalTimeLimit(requestType, requestTimeZone, isNewTOS, investmentDateString)
	const requestRegistrationDate = getRequestRegistrationDate(requestType, requestTimeZone, refundRequestDateString)

	const isWithinApprovalTimeLimit = requestRegistrationDate <= approvalTimeLimit

	return isWithinApprovalTimeLimit
}

export { getApprovalTimeLimit, getRequestRegistrationDate, checkIfRequestApproved, getRefundDeadlineDate }