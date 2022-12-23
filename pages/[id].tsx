import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Potluk from '../models/potluk'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faArrowUpRightFromSquare,
	faList,
} from '@fortawesome/free-solid-svg-icons'
import copy from 'copy-to-clipboard'
import Box from '../components/Box'
import BoxItem from '../components/BoxItem'
import Item from '../models/item'
import AddItemButton from '../components/AddItemButton'
import BoxHeader from '../components/BoxHeader'
import { useEffect, useState } from 'react'
import InputField from '../components/InputField'
import UniqueID from '../models/uniqueId'
import {
	addItemToDatabase,
	bringOrUnbringItemInDatabase,
	changeItemNameInDatabase,
	deleteItemFromDatabase,
	getPotlukJson,
	publishItemEvent,
	signIntoFirebase,
	subscribeToUpdates
} from '../firebase/firebase'
import ItemEvent, { ItemEventType } from '../models/itemEvent'
import React from 'react'

type Props = {
	initialPotlukJson: any
	initialUsername: string
}

export default function Main({ initialPotlukJson, initialUsername }: Props) {
	const [potluk, setPotluk] = useState(Potluk.createFromJson(initialPotlukJson))
	const [username, setUsername] = useState(initialUsername)
	const [loginFieldValue, setLoginFieldValue] = useState('')

	const router = useRouter()

	function removeQueryString() {
		if (!router.query.id) {
			console.error('Unexpected error: router.query does not contain key "id"')
			return
		}
		
		const urlHasQueryString = Object.keys(router.query).length > 1

		if (urlHasQueryString) {
			const purePath = router.asPath.substring(0, router.query.id.length + 1)
			router.replace({ pathname: purePath }, undefined, { shallow: true })
		}
	}

	// remove query string on page load
	useEffect(removeQueryString, [])

	// sign into db
	useEffect(() => {
		signIntoFirebase()
	}, [])

	const eventHandlers: Record<ItemEventType, Function> = {
		[ItemEventType.ADD]: onAddEvent,
		[ItemEventType.CHANGE_NAME]: onChangeItemNameEvent,
		[ItemEventType.BRING]: onBringOrUnbringEvent,
		[ItemEventType.UNBRING]: onBringOrUnbringEvent,
		[ItemEventType.DELETE]: onDeleteEvent,
	}

	// get realtime updates
	useEffect(() => {
		return subscribeToUpdates(initialPotlukJson.id, (snapshot) => {
			const event: ItemEvent = snapshot.val()
			eventHandlers[event.type](event)
		})
	}, [])

	if (router.isFallback) {
		return <p>Loading...</p>
	}

	interface ShareData {
		title?: string
		url?: string
		text?: string
	}

	function share(data: ShareData) {
		if (!navigator.canShare || !navigator.canShare(data)) {
			const text = data.text || data.url || 'Error'
			copy(text)
			alert('✅ Copied to clipboard')
			return
		}
		navigator.share(data)
	}

	function shareLink() {
		share({
			title: potluk.eventName,
			url: window.location.href,
		})
	}

	function shareList() {
		share({
			text: generateListString(potluk),
		})
	}

	function generateListString(potluk: Potluk) {
		let text = `👉 ${potluk.eventName}\n📆 ${customDateString(
			potluk.eventDate
		)}\n🔗 ${window.location.href}\n`

		for (const category of potluk.categories) {
			text += '\n' + category.name.toUpperCase() + '\n'

			if (!category.items) continue
			for (const item of Object.values(category.items)) {
				text += item.broughtByUser ? '✅ ' : '⬜️ '
				text +=
					item.name +
					(item.broughtByUser ? ` (${item.broughtByUser})` : '') +
					'\n'
			}
		}
		return text
	}

	function addItem(categoryIndex: number) {
		const itemId = UniqueID.generateUniqueId()

		publishItemEvent(potluk.id, {
			type: ItemEventType.ADD,
			categoryIndex,
			itemId,
			user: username
		})

		addItemToDatabase(potluk.id, new Item('', username, null, categoryIndex, itemId))
	}

	function onAddEvent(addEvent: ItemEvent): void {
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

	function deleteItem(item: Item) {
		publishItemEvent(potluk.id, {
			type: ItemEventType.DELETE,
			categoryIndex: item.categoryIndex,
			itemId: item.id,
			user: username
		})
		
		deleteItemFromDatabase(potluk.id, item)
	}

	function onDeleteEvent(deleteEvent: ItemEvent) {
		const items = potluk.categories[deleteEvent.categoryIndex].items

		console.log('Delete Item', items[deleteEvent.itemId])
		delete items[deleteEvent.itemId]

		// set state so UI reacts
		setPotluk(potluk.copy())
	}

	function bringOrUnbringItem(item: Item, bring: boolean) {
		publishItemEvent(potluk.id, {
			type: bring ? ItemEventType.BRING : ItemEventType.UNBRING,
			categoryIndex: item.categoryIndex,
			itemId: item.id,
			user: username
		})
		
		bringOrUnbringItemInDatabase(potluk.id, item, username, bring)
	}

	function onBringOrUnbringEvent(bringEvent: ItemEvent) {
		const bring = bringEvent.type === ItemEventType.BRING
		const item = potluk.categories[bringEvent.categoryIndex].items[bringEvent.itemId]
		item.broughtByUser = bring ? bringEvent.user : null
		console.log(bring ? 'Bring Item' : 'Unbring Item', item)
		setPotluk(potluk.copy())
	}

	function changeItemName(item: Item, name: string) {
		publishItemEvent(potluk.id, {
			type: ItemEventType.CHANGE_NAME,
			categoryIndex: item.categoryIndex,
			itemId: item.id,
			user: username,
			name
		})
		
		changeItemNameInDatabase(potluk.id, item, name)
	}

	function onChangeItemNameEvent(changeNameEvent: ItemEvent) {
		const item = potluk.categories[changeNameEvent.categoryIndex].items[changeNameEvent.itemId]
		item.name = changeNameEvent.name as string
		console.log('Change Item Name', item)
		setPotluk(potluk.copy())
	}

	function login() {
		if (loginFieldValue.trim()) {
			setUsername(loginFieldValue.trim())
		}
	}

	function logout() {
		setUsername('')
	}

	function customDateString(date: Date) {
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
				<title>{potluk.eventName}</title>
			</Head>

			<h2 className='mb-1'>{potluk.eventName}</h2>
			<p className='is-uppercase has-text-grey has-text-weight-bold'>
				{customDateString(potluk.eventDate)}
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

			{potluk.categories.map((category) => (
				<Box key={category.index}>
					<BoxHeader text={category.name} />
					{Object.values(category.items).map((item) => (
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
						<AddItemButton onClick={() => addItem(category.index)} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
	if (!context.params) {
		return {
			notFound: true,
		}
	}

	let initialPotlukJson
	try {
		initialPotlukJson = await (getPotlukJson(context.params.id as string))
	} catch {
		return {
			notFound: true,
		}
	}

	if (!initialPotlukJson) {
		return {
			notFound: true,
		}
	}

	const initialUsername =
		decodeURIComponent(context.query.u?.toString() || '') || null

	return {
		props: {
			initialPotlukJson: initialPotlukJson,
			initialUsername: initialUsername,
		},
	}
}
