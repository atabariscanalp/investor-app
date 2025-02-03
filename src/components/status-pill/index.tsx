import React from 'react'

const StatusPill = ({
	status,
}: {
	status: boolean
}) => {
	return (
		<div className={`status-pill ${status ? 'approved' : 'not-approved'}`}>
			{status ? 'Yes' : 'No'}
		</div>
	)
}

export default StatusPill