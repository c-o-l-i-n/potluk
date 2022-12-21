import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import Item from '../models/item'
import { useEffect, useState } from 'react'

type Props = {
	initialItem: Item
	onChangeItemName: (item: Item, name: string) => unknown
	onBringOrUnbring: (item: Item, bring: boolean) => unknown
	onDelete: (item: Item) => unknown
	username: string | null
}

const BoxItem = ({
	initialItem,
	onChangeItemName,
	onBringOrUnbring,
	onDelete,
	username,
}: Props) => {
	const [item, setItem] = useState(initialItem)

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
					className={'input'}
					type='text'
					defaultValue={item.name}
					onBlur={(e) => onChangeItemName(item, (e.target as HTMLInputElement).value.trim())}
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
							className='button is-dark is-size-7 ml-3 has-text-weight-bold'
							onClick={() => onBringOrUnbring(item, true)}
						>
							Bring
						</button>
					) : (
						<>
							{username === item.broughtByUser ? (
								<button
									type='button'
									className='button is-dark is-size-7 ml-3 has-text-weight-bold'
									onClick={() => onBringOrUnbring(item, false)}
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
					className='button is-danger ml-3'
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
