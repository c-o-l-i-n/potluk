import Head from 'next/head'
import Potluk from '../models/potluk'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faArrowUpRightFromSquare,
	faList,
} from '@fortawesome/free-solid-svg-icons'
import copy from 'copy-to-clipboard'
import Box from './Box'
import BoxItem from './BoxItem'
import Item from '../models/item'
import AddItemButton from './AddItemButton'
import BoxHeader from './BoxHeader'
import { ReactElement, useEffect, useState } from 'react'
import InputField from './InputField'
import UniqueID from '../models/uniqueId'
import {
	addItemToDatabase,
	bringOrUnbringItemInDatabase,
	changeItemNameInDatabase,
	deleteItemFromDatabase,
	publishItemEvent,
	subscribeToUpdates
} from '../firebase/firebase'
import ItemEvent, { ItemEventType } from '../models/itemEvent'

type Props = {
	initialPotluk: Potluk
	initialUsername: string
}

export default function PotlukView({initialPotluk, initialUsername}: Props): ReactElement {
	const [potluk, setPotluk] = useState<Potluk>(initialPotluk)
	const [username, setUsername] = useState(initialUsername)
	const [loginFieldValue, setLoginFieldValue] = useState('')

	// get realtime updates
	useEffect(() =>
		subscribeToUpdates(initialPotluk.id, (snapshot) => {
			const event: ItemEvent = snapshot.val()
			eventHandlers[event.type](event)
		}), [])

	const eventHandlers: Record<ItemEventType, Function> = {
		[ItemEventType.ADD]: onAddEvent,
		[ItemEventType.CHANGE_NAME]: onChangeItemNameEvent,
		[ItemEventType.BRING]: onBringOrUnbringEvent,
		[ItemEventType.UNBRING]: onBringOrUnbringEvent,
		[ItemEventType.DELETE]: onDeleteEvent,
	}

	function addItem(categoryIndex: number): void {
		const itemId = UniqueID.generateUniqueId()
		console.log(potluk);

		publishItemEvent(potluk.id, {
			type: ItemEventType.ADD,
			categoryIndex,
			itemId,
			user: username
		})

		
		addItemToDatabase(potluk.id, new Item('', username, null, categoryIndex, itemId))
	}

	function onAddEvent(addEvent: ItemEvent): void {
		console.log(potluk);
		
		const category = potluk.categories[addEvent.categoryIndex]

		if (!category.items) {
			category.items = {}
		}

		const item = new Item('', addEvent.user, null, addEvent.categoryIndex, addEvent.itemId)
		console.log('Add Item', item)
		
		category.items[item.id] = item

		// set state so UI reacts
		setPotluk(potluk.copy())
	}

	function deleteItem(item: Item): void {

		publishItemEvent(potluk.id, {
			type: ItemEventType.DELETE,
			categoryIndex: item.categoryIndex,
			itemId: item.id,
			user: username
		})
		
		deleteItemFromDatabase(potluk.id, item)
	}

	function onDeleteEvent(deleteEvent: ItemEvent): void {
		const items = potluk.categories[deleteEvent.categoryIndex].items

		console.log('Delete Item', items[deleteEvent.itemId])
		delete items[deleteEvent.itemId]

		// set state so UI reacts
		setPotluk(potluk.copy())
	}

	function bringOrUnbringItem(item: Item, bring: boolean): void {
		publishItemEvent(potluk.id, {
			type: bring ? ItemEventType.BRING : ItemEventType.UNBRING,
			categoryIndex: item.categoryIndex,
			itemId: item.id,
			user: username
		})
		
		bringOrUnbringItemInDatabase(potluk.id, item, username, bring)
	}

	function onBringOrUnbringEvent(bringEvent: ItemEvent): void {
		const bring = bringEvent.type === ItemEventType.BRING
		const item = potluk.categories[bringEvent.categoryIndex].items[bringEvent.itemId]
		item.broughtBy = bring ? bringEvent.user : null
		console.log(bring ? 'Bring Item' : 'Unbring Item', item)
		setPotluk(potluk.copy())
	}

	function changeItemName(item: Item, name: string): void {
		publishItemEvent(potluk.id, {
			type: ItemEventType.CHANGE_NAME,
			categoryIndex: item.categoryIndex,
			itemId: item.id,
			user: username,
			name
		})
		
		changeItemNameInDatabase(potluk.id, item, name)
	}

	function onChangeItemNameEvent(changeNameEvent: ItemEvent): void {
		const item = potluk.categories[changeNameEvent.categoryIndex].items[changeNameEvent.itemId]
		item.name = changeNameEvent.name as string
		console.log('Change Item Name', item)
		setPotluk(potluk.copy())
	}

	interface ShareData {
		title?: string
		url?: string
		text?: string
	}

	function share(data: ShareData): void {
		if (!navigator.canShare || !navigator.canShare(data)) {
			const text = data.text || data.url || 'Error'
			copy(text)
			alert('✅ Copied to clipboard')
			return
		}
		navigator.share(data)
	}

	function shareLink(): void {
		share({
			title: potluk.name,
			url: window.location.href,
		})
	}

	function shareList(): void {
		share({
			text: generateListString(potluk),
		})
	}

	function generateListString(potluk: Potluk): string {
		let text = `👉 ${potluk.name}\n📆 ${customDateString(
			potluk.date
		)}\n🔗 ${window.location.href.split('://').at(-1)}\n`

		for (const category of potluk.categories) {
			text += '\n' + category.name.toUpperCase() + '\n'

			if (!category.items) continue
			for (const item of Object.values(category.items)) {
				text += item.broughtBy ? '✅ ' : '⬜️ '
				text +=
					item.name +
					(item.broughtBy ? ` (${item.broughtBy})` : '') +
					'\n'
			}
		}
		return text
	}

	function login(): void {
		if (loginFieldValue.trim()) {
			setUsername(loginFieldValue.trim())
		}
	}

	function logout(): void {
		setUsername('')
		setLoginFieldValue('')
	}

	function customDateString(date: Date): string {
		const correctedDate = new Date(new Date(date).toISOString().slice(0, -1))
		const options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}
		return correctedDate.toLocaleDateString('en-US', options)
	}

	return (
		<>
			<Head>
				<title>{potluk.name}</title>
			</Head>

			<h2 className='mb-1'>{potluk.name}</h2>
			<p className='is-uppercase has-text-grey has-text-weight-bold'>
				{customDateString(potluk.date)}
			</p>
			<div className='is-flex is-justify-content-space-between is-align-items-center mb-5 w-100'>
				{username ? (
					<>
						<p className='mb-0'>
							Logged in as: <strong>{username}</strong>
						</p>
						<button
							type='button'
							className='button is-primary ml-3'
							onClick={logout}
						>
							Log Out
						</button>
					</>
				) : (
					<>
						<InputField
							type='text'
							label='Enter your name to edit'
							placeholder='Name'
							onChange={setLoginFieldValue}
							onEnterKeyPressed={login}
							swapBold={true}
						/>
						<button
							type='button'
							className='button is-primary mb-3 ml-3 is-align-self-flex-end'
							onClick={login}
						>
							Log In
						</button>
					</>
				)}
			</div>

			{potluk.categories.map((category, categoryIndex) => (
				<Box key={categoryIndex}>
					<BoxHeader text={category.name} />
					{Object.values(category.items).map(item => (
						<BoxItem
							key={item.id}
							initialItem={item}
							onChangeItemName={changeItemName}
							onBringOrUnbring={bringOrUnbringItem}
							onDelete={deleteItem}
							username={username}
						/>
					))}
					{username ? (
						<AddItemButton onClick={() => addItem(categoryIndex)} />
					) : (
						<></>
					)}
				</Box>
			))}

			<div className='buttons is-flex is-justify-content-center mt-6 mb-0'>
				<button
					type='button'
					className='button is-primary'
					onClick={shareList}
				>
					<span>Share List</span>
					<span className='icon'>
						<FontAwesomeIcon icon={faList} />
					</span>
				</button>
				<button
					type='button'
					className='button is-primary'
					onClick={shareLink}
				>
					<span>Share Link</span>
					<span className='icon'>
						<FontAwesomeIcon icon={faArrowUpRightFromSquare} />
					</span>
				</button>
			</div>
		</>
	)
}
