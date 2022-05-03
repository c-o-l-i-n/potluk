import { NextPage } from 'next'
import { useState } from 'react'
import CreateButton from '../components/CreateButton'
import Category from '../models/category'
import InputField from '../components/InputField'
import Potluk from '../models/potluk'
import axios from 'axios'
import router from 'next/router'
import BoxCategoryItem from '../components/BoxCategoryItem'
import AddItemButton from '../components/AddItemButton'
import BoxHeader from '../components/BoxHeader'
import Box from '../components/Box'

const New: NextPage = () => {
	const defaultDate = new Date(new Date().setDate(new Date().getDate() + 7)) // 1 week in the future
	const defaultCategories = [
		new Category('Mains', []),
		new Category('Sides', []),
		new Category('Desserts', []),
		new Category('Drinks', []),
	]

	const [eventName, setEventName] = useState<string>('')
	const [eventDate, setEventDate] = useState<Date>(defaultDate)
	const [username, setUsername] = useState<string>('')
	const [categories, setCategories] = useState<Category[]>(defaultCategories)
	const [isLoading, setIsLoading] = useState(false)

	const addCategory = () => {
		const category = new Category('', [])
		setCategories([...categories, category])
	}

	const deleteCategory = (id: string) => {
		const newCategories = categories.filter((c) => c.id !== id)
		setCategories(newCategories)
	}

	const createPotluk = async () => {
		setIsLoading(true)
		const potluk = new Potluk(eventName, eventDate, categories)
		await axios.post('/api/v1/potluk', potluk)
		router.push(`/${potluk.id}?u=${username}`)
	}

	return (
		<>
			<main className='section'>
				<div className='container'>
					<InputField
						type='text'
						label='Event Name'
						placeholder='House Warming Party'
						onChange={setEventName}
						onEnterKeyPressed={() => {}}
						disabled={isLoading}
					/>
					<InputField
						type='date'
						label='Event Date'
						onChange={setEventDate}
						onEnterKeyPressed={() => {}}
						disabled={isLoading}
					/>
					<InputField
						type='text'
						label='Your Name'
						placeholder='Colin'
						onChange={setUsername}
						onEnterKeyPressed={() => {}}
						disabled={isLoading}
					/>

					<Box>
						<BoxHeader text='Categories' />

						{categories.map((category, index) => (
							<BoxCategoryItem
								key={category.id}
								category={category}
								onDelete={deleteCategory}
								disabled={isLoading}
							/>
						))}

						<AddItemButton onClick={addCategory} disabled={isLoading} />
					</Box>
				</div>

				<div className='is-flex is-justify-content-center'>
					<CreateButton onClick={createPotluk} isLoading={isLoading} />
				</div>
			</main>
		</>
	)
}

export default New
