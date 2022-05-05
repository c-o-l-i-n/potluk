import type { NextPage } from 'next'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Potluk</title>
			</Head>

			<main
				className='section
				content
				is-flex
				is-flex-direction-column
				is-align-items-center
				is-justify-content-space-between'
			>
				<Image
					src='/img/family-meal.svg'
					alt='People eating a meal'
					width={300}
					height={230}
				/>

				<p className='has-text-centered is-size-4 mt-6 mb-3'>
					Who&apos;s bringing what?
				</p>
				<p className='has-text-centered is-size-4 mb-5'>
					Coordinate with <strong>Potluk</strong>!
				</p>

				<Link href='/new' passHref>
					<button
						type='button'
						className='button is-primary is-size-4 is-large has-text-weight-bold mt-3 mb-5'
					>
						Create New Potluk
					</button>
				</Link>

				<ol className='is-size-5'>
					<li>Create a Potluk for your event</li>
					<li>Share the link with friends</li>
					<li>Choose what you bring</li>
				</ol>
			</main>
		</>
	)
}

export default Home
