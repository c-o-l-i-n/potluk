import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Potluk from '../models/potluk'
import absoluteUrl from 'next-absolute-url'
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
import Category from '../models/category'
import UniqueID from '../models/uniqueId'

type Props = {
	initialPotlukJson: any
	initialUsername: string
}

export default function Main({ initialPotlukJson, initialUsername }: Props) {
	const [potluk, setPotluk] = useState(Potluk.createFromJson(initialPotlukJson))
	const [username, setUsername] = useState(initialUsername)
	const [loginFieldValue, setLoginFieldValue] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const router = useRouter()

	const removeQueryString = () => {
		const urlHasQueryString = Object.keys(router.query).length > 1

		if (urlHasQueryString) {
			const purePath = router.asPath.substring(0, UniqueID.ID_LENGTH + 1)
			router.replace({ pathname: purePath }, undefined, { shallow: true })
		}
	}

	// remove query string on page load
	useEffect(removeQueryString, [])

	// update database when potluk is changed
	useEffect(() => {
		setIsLoading(true)
		fetch(`/api/v1/potluk/${potluk.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(potluk),
		}).then(() => {
			setIsLoading(false)
		})
	}, [potluk])

	if (!potluk) {
		return (
			<p>Potluk with ID &quot;{router.asPath.substring(1)}&quot; not found</p>
		)
	}

	if (router.isFallback) {
		return <p>Loading...</p>
	}

	type ShareData = {
		title?: string
		url?: string
		text?: string
	}

	const share = (data: ShareData) => {
		if (!navigator.canShare || !navigator.canShare(data)) {
			const text = data.text || data.url || 'Error'
			copy(text)
			alert('✅ Copied to clipboard')
			return
		}
		navigator.share(data)
	}

	const shareLink = async () => {
		share({
			title: potluk.eventName,
			url: window.location.href,
		})
	}

	const shareList = async () => {
		share({
			text: generateListString(potluk),
		})
	}

	const generateListString = (potluk: Potluk) => {
		let text = `👉 ${potluk.eventName}\n📆 ${customDateString(
			initialPotlukJson.eventDate
		)}\n🔗 ${window.location.href}\n`

		for (const category of potluk.categories) {
			text += '\n' + category.name.toUpperCase() + '\n'

			if (!category.items) continue
			for (const item of category.items) {
				text += item.broughtByUser ? '✅ ' : '⬜️ '
				text +=
					item.name +
					(item.broughtByUser ? ` (${item.broughtByUser})` : '') +
					'\n'
			}
		}
		return text
	}

	const addItem = (categoryId: string) => {
		// so TS doesn't get mad at me
		if (!username) return

		const category = {
			...potluk.categories.find((c) => c.id === categoryId),
		} as Category

		category.items.push(new Item('', username, null, categoryId))

		const categories = UniqueID.updateListItemMaintainOrder(
			potluk.categories,
			category
		) as Category[]

		setPotluk({ ...potluk, categories: categories } as Potluk)
	}

	const deleteItem = (item: Item) => {
		const category = {
			...potluk.categories.find((c) => c.id === item.categoryId),
		} as Category

		if (!category?.items) {
			console.error(`Category ${item.categoryId} or its items not found`)
			return
		}

		category.items = UniqueID.deleteListItemMaintainOrder(
			category.items,
			item.id
		) as Item[]

		const categories = UniqueID.updateListItemMaintainOrder(
			potluk.categories,
			category
		) as Category[]

		setPotluk({ ...potluk, categories: categories } as Potluk)
	}

	const changeItem = (item: Item) => {
		const category = {
			...potluk.categories.find((c) => c.id === item.categoryId),
		} as Category

		if (!category?.items) {
			console.error(`Category ${item.categoryId} or its items not found`)
			return
		}

		category.items = UniqueID.updateListItemMaintainOrder(
			category.items,
			item
		) as Item[]

		const categories = UniqueID.updateListItemMaintainOrder(
			potluk.categories,
			category
		) as Category[]

		setPotluk({ ...potluk, categories: categories } as Potluk)
	}

	const login = () => {
		if (loginFieldValue.trim()) {
			setLoginFieldValue('')
			setUsername(loginFieldValue.trim())
		}
	}

	const logout = () => {
		setUsername('')
	}

	const customDateString = (date: Date) => {
		const correctedDate = new Date(new Date(date).toISOString().slice(0, -1))
		const options = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		} as Intl.DateTimeFormatOptions
		return correctedDate.toLocaleDateString('en-US', options)
	}

	return (
		<>
			<Head>
				<title>{potluk.eventName}</title>
			</Head>

			<h2 className='mb-1'>{potluk.eventName}</h2>
			<p className='is-uppercase has-text-grey has-text-weight-bold'>
				{customDateString(initialPotlukJson.eventDate)}
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
							disabled={isLoading}
						>
							Log Out
						</button>
					</>
				) : (
					<>
						<InputField
							type='text'
							label='Log in to edit'
							placeholder='Name'
							onChange={setLoginFieldValue}
							onEnterKeyPressed={login}
							disabled={isLoading}
							swapBold={true}
						/>
						<button
							type='button'
							className='button is-primary mb-3 ml-3 is-align-self-flex-end'
							onClick={login}
							disabled={isLoading}
						>
							Log In
						</button>
					</>
				)}
			</div>

			{potluk.categories.map((category) => (
				<Box key={category.id}>
					<BoxHeader text={category.name} />
					{category.items?.map((item) => (
						<BoxItem
							key={item.id}
							initialItem={item}
							onChange={changeItem}
							onDelete={deleteItem}
							disabled={isLoading}
							username={username}
						/>
					))}
					{username ? (
						<AddItemButton
							onClick={() => addItem(category.id)}
							disabled={isLoading}
						/>
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
					disabled={isLoading}
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
					disabled={isLoading}
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

	const { origin } = absoluteUrl(context.req)
	const request = await fetch(`${origin}/api/v1/potluk/${context.params.id}`)

	let initialPotlukJson
	try {
		initialPotlukJson = await request.json()
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
