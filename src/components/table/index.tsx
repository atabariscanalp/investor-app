import React from 'react'
import { getRefundDeadlineDate, getRequestRegistrationDate } from '../../util/investor.util'
import { getDayOfWeek } from '../../util/date.util'
import { RequestType } from '../../types/types'
import { RequestTimeZone } from '../../types/types'
import { RequestData } from '../../types/types'
import { checkIfRequestApproved } from '../../util/investor.util'
import StatusPill from '../status-pill'

const Table = ({
	requestData,
}: {
	requestData: RequestData
}) => {
	return (
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Request Timezone</th>
					<th>Signup Date</th>
					<th>Request Type</th>
					<th>Investment Date</th>
					<th>Refund Request Date</th>
					<th>Is Approved</th>
					<th>Refund Registration Date</th>
					<th>Refund Deadline Date</th>
				</tr>
			</thead>
			<tbody>
				{requestData.data.map((request) => (
					<tr key={request.name}>
						<td>{request.name}</td>
						<td>{request.requestTimeZone}</td>
						<td>{request.signupDate}</td>
						<td>{request.requestType}</td>
						<td>{`${request.investmentDate} ${request.investmentTime}`}</td>
						<td>{`${request.refundRequestDate} ${request.refundRequestTime} (${getDayOfWeek(request.refundRequestDate, request.requestTimeZone as RequestTimeZone)})`}</td>
						<td>{checkIfRequestApproved(
							request.requestTimeZone as RequestTimeZone,
							request.requestType as RequestType,
							request.signupDate,
							`${request.investmentDate} ${request.investmentTime}`,
							`${request.refundRequestDate} ${request.refundRequestTime}`,
						) ? <StatusPill status={true} /> : <StatusPill status={false} />}</td>
						<td>{getRequestRegistrationDate(
							request.requestType as RequestType,
							request.requestTimeZone as RequestTimeZone,
							`${request.refundRequestDate} ${request.refundRequestTime}`,
						).toUTCString()}</td>
						<td>{getRefundDeadlineDate(
							request.signupDate,
							`${request.investmentDate} ${request.investmentTime}`,
							request.requestTimeZone as RequestTimeZone,
							request.requestType as RequestType,
						).toString()}</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default Table