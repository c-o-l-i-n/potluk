import React from 'react'

type Props = {
	text: string
}

const BoxHeader = ({ text }: Props) => {
	return (
		<div className='potluk-box-item is-size-5 has-text-centered has-text-weight-bold'>
			{text}
		</div>
	)
}

export default BoxHeader
