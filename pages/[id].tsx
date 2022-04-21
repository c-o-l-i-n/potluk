import axios from 'axios'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Potluk from '../models/potluk'
import absoluteUrl from 'next-absolute-url'
import Category from '../models/category'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faArrowUpRightFromSquare,
	faList,
} from '@fortawesome/free-solid-svg-icons'
import copy from 'copy-to-clipboard'
import { eventNames } from 'process'

type Props = {
	potluk: Potluk
}

const props = {
	eventName: 'House Warming Party',
	eventDate: 'April 20, 2022',
	username: 'Colin',
	categories: [
		{
			name: 'Mains',
			items: [
				{
					name: 'Taco Casserole',
					broughtByUser: 'Colin',
					createdByUser: 'Colin',
				},
				{
					name: 'Pizza',
					broughtByUser: 'Molly',
					createdByUser: 'Molly',
				},
				{
					name: 'BBQ Meatballs',
					broughtByUser: null,
					createdByUser: 'Colin',
				},
			],
		},
		{
			name: 'Sides',
			items: [
				{
					name: 'Nachos and Queso',
					broughtByUser: 'Verbsky',
					createdByUser: 'Colin',
				},
			],
		},
		{
			name: 'Drinks',
			items: [
				{
					name: 'Fruit Punch',
					broughtByUser: null,
					createdByUser: 'Colin',
				},
				{
					name: 'Lemonade',
					broughtByUser: null,
					createdByUser: 'Colin',
				},
			],
		},
	],
}

export default function Edit({ potluk }: Props) {
	const username = 'Colin'

	const router = useRouter()

	if (router.isFallback) {
		return <p>Loading...</p>
	}

	type ShareData = {
		title?: string
		url?: string
		text?: string
	}

	const share = async (data: ShareData) => {
		if (!navigator.canShare || !navigator.canShare(data)) {
			const text = data.text || data.url || 'Error'
			copy(text)
			alert('✅ Copied to clipboard')
			return
		}
		try {
			await navigator.share(data)
			alert('✅ Shared successfully')
		} catch (err) {
			alert('❌ ' + err)
		}
	}

	const shareLink = async () => {
		share({
			title: potluk.eventName,
			url: window.location.href,
		})
	}

	const shareList = async () => {
		share({
			text: await generateListString(props),
		})
	}

	const generateListString = async (potluk: any) => {
		let text = `${potluk.eventName}\n${new Date(
			potluk.eventDate
		).toLocaleDateString()}\n${window.location.href}\n`

		for (const category of potluk.categories) {
			text += '\n' + category.name.toUpperCase() + '\n'
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

	if (potluk) {
		return (
			<>
				<Head>
					<title>{potluk.eventName}</title>
				</Head>

				<main
					className='section
					content
					is-flex
					is-flex-direction-column
					is-align-items-center
					is-justify-content-space-between'
				>
					<h1>{potluk.eventName}</h1>
					<h6 className='is-uppercase'>
						{new Date(potluk.eventDate.toString()).toDateString()}
					</h6>
					<div className='is-flex is-justify-content-space-between is-align-items-flex-end'>
						<p>Logged in as: {username}</p>
						<button className='button is-primary'>Log Out</button>
					</div>

					<p className='buttons'>
						<button className='button is-primary' onClick={shareList}>
							<span>Share List</span>
							<span className='icon'>
								<FontAwesomeIcon icon={faList} />
							</span>
						</button>
						<button className='button is-primary' onClick={shareLink}>
							<span>Share Link</span>
							<span className='icon'>
								<FontAwesomeIcon icon={faArrowUpRightFromSquare} />
							</span>
						</button>
					</p>
				</main>
			</>
		)
	} else {
		return (
			<p>Potluk with ID &quot;{router.asPath.substring(1)}&quot; not found</p>
		)
	}
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	if (!context.params) {
		return {
			props: {
				potluk: null,
			},
		}
	}

	const { origin } = absoluteUrl(context.req)
	const request = await fetch(
		`${origin}/api/v1/potluk/${context.params.id}`.replace('https', 'http')
	)

	if (request.status !== 200) {
		return {
			props: {
				potluk: null,
			},
		}
	}

	const potluk = await request.json()

	return {
		props: {
			potluk: potluk,
		},
	}
}
