import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import Category from '../models/category'
import Item from '../models/item'
import { useEffect, useState } from 'react'

type Props = {
	initialItem: Item
	onChange: Function
	onDelete: Function
	disabled: boolean
	username: string | null
}

const BoxItem = ({
	initialItem,
	onChange,
	onDelete,
	disabled,
	username,
}: Props) => {
	const [item, setItem] = useState(initialItem)

	useEffect(() => {
		if (item === initialItem) return

		onChange(item)
	}, [item])

	useEffect(() => {
		setItem(initialItem)
	}, [initialItem])

	return (
		<div className='box-item is-flex is-justify-content-space-between is-align-items-center'>
			<span
				className={`icon is-size-4 mr-4 ${
					item.broughtByUser ? 'has-text-primary' : 'has-text-grey'
				}`}
			>
				<FontAwesomeIcon icon={item.broughtByUser ? faCheckCircle : faCircle} />
			</span>
			{username && username === item.createdByUser && !item.broughtByUser ? (
				<input
					className={`input ${disabled ? 'disabled' : ''}`}
					type='text'
					defaultValue={item.name}
					onBlur={(e) => {
						setItem({
							...item,
							name: (e.target as HTMLInputElement).value.trim(),
						} as Item)
					}}
				></input>
			) : (
				<div className='mr-auto'>
					<p className='mb-0 has-text-weight-bold'>{item.name}</p>
					{item.broughtByUser ? (
						<p className='is-size-7'>{item.broughtByUser} is bringing</p>
					) : (
						<></>
					)}
				</div>
			)}

			{username ? (
				<>
					{!item.broughtByUser ? (
						<button
							type='button'
							className={`button is-dark is-size-7 ml-3 has-text-weight-bold ${
								disabled ? 'disabled' : ''
							}`}
							onClick={() => {
								setItem({ ...item, broughtByUser: username } as Item)
							}}
						>
							Bring
						</button>
					) : (
						<>
							{username === item.broughtByUser ? (
								<button
									type='button'
									className={`button is-dark is-size-7 ml-3 has-text-weight-bold ${
										disabled ? 'disabled' : ''
									}`}
									onClick={() => {
										setItem({ ...item, broughtByUser: '' } as Item)
									}}
								>
									Unbring
								</button>
							) : (
								<></>
							)}
						</>
					)}
				</>
			) : (
				<></>
			)}
			{username === item.createdByUser && !item.broughtByUser ? (
				<button
					type='button'
					className={`button is-danger ml-3 ${disabled ? 'disabled' : ''}`}
					onClick={() => {
						onDelete(item)
					}}
				>
					<span className='icon is-small'>
						<FontAwesomeIcon icon={faTrashCan} />
					</span>
				</button>
			) : (
				<></>
			)}
		</div>
	)
}

export default BoxItem
