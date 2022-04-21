import { NextPage } from 'next'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import CreateButton from '../components/CreateButton'
import Category from '../models/category'
import InputField from '../components/InputField'

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

	return (
		<>
			<main className='section'>
				<div className='container'>
					<InputField
						type='text'
						label='Event Name'
						placeholder='House Warming Party'
						onChange={setEventName}
					/>
					<InputField type='date' label='Event Date' onChange={setEventDate} />
					<InputField
						type='text'
						label='Your Name'
						placeholder='Colin'
						onChange={setUsername}
					/>
					<div className='box potluk-box mb-6'>
						<p className='potluk-box-item is-size-5 has-text-centered has-text-weight-bold'>
							Categories
						</p>
						<div className='potluk-box-item is-flex is-justify-content-space-between is-align-items-center'>
							<input type='text' defaultValue='Mains'></input>
							<button className='button is-danger'>
								<span className='icon is-small'>
									<FontAwesomeIcon icon={faTrashCan} />
								</span>
							</button>
						</div>
						<div className='potluk-box-item is-flex is-justify-content-space-between is-align-items-center'>
							<input type='text' defaultValue='Sides'></input>
							<button className='button is-danger'>
								<span className='icon is-small'>
									<FontAwesomeIcon icon={faTrashCan} />
								</span>
							</button>
						</div>
						<div className='potluk-box-item is-flex is-justify-content-space-between is-align-items-center'>
							<input type='text' defaultValue='Desserts'></input>
							<button className='button is-danger'>
								<span className='icon is-small'>
									<FontAwesomeIcon icon={faTrashCan} />
								</span>
							</button>
						</div>
						<div className='potluk-box-item is-flex is-justify-content-space-between is-align-items-center'>
							<input type='text' defaultValue='Drinks'></input>
							<button className='button is-danger'>
								<span className='icon is-small'>
									<FontAwesomeIcon icon={faTrashCan} />
								</span>
							</button>
						</div>
						<div className='potluk-box-item is-flex is-justify-content-center is-align-items-center'>
							<button className='button is-medium is-ghost'>
								<span className='icon is-medium'>
									<FontAwesomeIcon
										icon={faPlusCircle}
										className='has-text-grey fa-2x'
									/>
								</span>
							</button>
						</div>
					</div>
				</div>

				<div className='is-flex is-justify-content-center'>
					<CreateButton
						eventName={eventName}
						eventDate={eventDate}
						categories={categories}
					/>
				</div>
			</main>
		</>
	)
}

export default New
