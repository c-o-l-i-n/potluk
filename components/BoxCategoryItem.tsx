import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import Category from '../models/category'

type Props = {
	category: Category
	onDelete: Function
	disabled: boolean
}

const BoxCategoryItem = ({ category, onDelete, disabled }: Props) => {
	return (
		<div className='potluk-box-item is-flex is-justify-content-space-between is-align-items-center'>
			<input
				className='input mr-4'
				type='text'
				defaultValue={category.name}
				onInput={(e) => {
					category.name = (e.target as HTMLInputElement).value
				}}
				disabled={disabled}
			></input>
			<button
				className='button is-danger'
				onClick={() => {
					onDelete(category.id)
				}}
				disabled={disabled}
			>
				<span className='icon is-small'>
					<FontAwesomeIcon icon={faTrashCan} />
				</span>
			</button>
		</div>
	)
}

export default BoxCategoryItem
