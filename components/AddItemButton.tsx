import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

type Props = {
	onClick: Function
	disabled: boolean
}

const AddItemButton = ({ onClick, disabled }: Props) => {
	return (
		<div className='potluk-box-item is-flex is-justify-content-center is-align-items-center'>
			<button
				className='button is-medium is-ghost'
				onClick={() => onClick()}
				disabled={disabled}
			>
				<span className='icon is-medium'>
					<FontAwesomeIcon
						icon={faPlusCircle}
						className='has-text-grey fa-2x'
					/>
				</span>
			</button>
		</div>
	)
}

export default AddItemButton
