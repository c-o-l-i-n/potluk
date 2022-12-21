import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import Category from '../models/category'

type Props = {
	category: Category
	onDelete: (categoryIndex: number) => unknown
	onChange: (name: string) => unknown
	disabled: boolean
}

const BoxCategoryItem = ({ category, onDelete, onChange, disabled }: Props) => {
	return (
		<div className='box-item is-flex is-justify-content-space-between is-align-items-center'>
			<input
				className='input mr-4'
				type='text'
				defaultValue={category.name}
				onChange={(e) => onChange((e.target as HTMLInputElement).value.trim())}
				disabled={disabled}
			></input>
			<button
				type='button'
				className={`button is-danger ${disabled ? 'disabled' : ''}`}
				onClick={() => onDelete(category.index)}
			>
				<span className='icon is-small'>
					<FontAwesomeIcon icon={faTrashCan} />
				</span>
			</button>
		</div>
	)
}

export default BoxCategoryItem
