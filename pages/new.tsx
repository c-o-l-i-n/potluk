import { NextPage } from 'next'
import { useState } from 'react'
import CreateButton from '../components/CreateButton'
import Category from '../models/category'
import InputField from '../components/InputField'
import Potluk from '../models/potluk'
import router from 'next/router'
import BoxCategoryItem from '../components/BoxCategoryItem'
import AddItemButton from '../components/AddItemButton'
import BoxHeader from '../components/BoxHeader'
import Box from '../components/Box'
import Head from 'next/head'
import { createPotlukInDatabase, signIntoFirebase } from '../firebase/firebase'

const New: NextPage = () => {

	// default date is today in the format yyyy-mm-dd
	const [eventDateString, setEventDateString] = useState<string>(() =>
		new Date().toLocaleDateString('fr-CA', {
			year: 'numeric',
			month:'2-digit',
			day:'2-digit'
		}))
	const [eventName, setEventName] = useState<string>('')
	const [username, setUsername] = useState<string>('')
	const [categories, setCategories] = useState<Category[]>(() => [
			new Category(0, 'Appetizers'),
			new Category(0, 'Main Dishes'),
			new Category(0, 'Side Dishes'),
			new Category(0, 'Desserts'),
			new Category(0, 'Drinks'),
		])
	const [isLoading, setIsLoading] = useState(false)

	const addCategory = () => {
		const category = new Category(0, '')
		setCategories([...categories, category])
	}

	const deleteCategory = (categoryIndex: number) => {
		categories.splice(categoryIndex, 1)
		setCategories([...categories])
	}

	const createPotluk = async () => {
		setIsLoading(true)

		const potluk = new Potluk(eventName, new Date(eventDateString + 'T00:00:00.000'), categories)

		await signIntoFirebase()
		await createPotlukInDatabase(potluk)
		
		router.push(`/${potluk.id}?u=${username}`)
	}

	return (
		<>
			<Head>
				<title>Create New Potluk</title>
			</Head>

			<InputField
				type='text'
				label='Event Name'
				placeholder='House Warming Party'
				onChange={setEventName}
				disabled={isLoading}
			/>
			<InputField
				type='date'
				label='Event Date'
				onChange={setEventDateString}
				disabled={isLoading}
				defaultValue={eventDateString}
			/>
			<InputField
				type='text'
				label='Your Name'
				placeholder='Colin'
				onChange={setUsername}
				disabled={isLoading}
			/>

			<br />

			<Box>
				<BoxHeader text='Categories' />

				{categories.map((category, index) => (
					<BoxCategoryItem
						key={index}
						category={category}
						onDelete={() => deleteCategory(index)}
						onChange={(name) => {
							category.name = name
							setCategories([...categories])
						}}
						disabled={isLoading}
					/>
				))}

				<AddItemButton onClick={addCategory} disabled={isLoading} />
			</Box>

			<div className='is-flex is-justify-content-center mb-3'>
				<CreateButton
					onClick={createPotluk}
					isLoading={isLoading}
					disabled={
						!(
							eventName &&
							eventDateString &&
							categories.length &&
							categories.every((c) => !!c.name)
						)
					}
				/>
			</div>
		</>
	)
}

export default New
