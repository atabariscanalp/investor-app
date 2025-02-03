export enum RequestType {
	PHONE = 'PHONE',
	WEB_APP = 'WEB_APP',
}

export enum RequestTimeZone {
	US_PST = 'US_PST',
	US_EST = 'US_EST',
	EUROPE_CET = 'EUROPE_CET',
	EUROPE_GMT = 'EUROPE_GMT',
}

export interface RequestData {
	data: {
		name: string,
		requestTimeZone: RequestTimeZone,
		signupDate: string,
		requestType: RequestType,
		investmentDate: string,
		investmentTime: string,
		refundRequestDate: string,
		refundRequestTime: string,
	}[]
}