import axios from 'axios'
import { useRouter } from 'next/router'
import Category from '../models/category'
import Potluk from '../models/potluk'

type Props = {
	eventName: string
	eventDate: Date
	categories: Category[]
}

const CreateButton = ({ eventName, eventDate, categories }: Props) => {
	const router = useRouter()

	const onCreateButtonClick = async () => {
		const potluk = new Potluk(eventName, eventDate, categories)
		await axios.post('/api/v1/potluk', potluk)
		router.replace('/' + potluk.id)
	}

	return (
		<button
			className='button is-primary is-size-4 is-large has-text-weight-bold mt-3'
			onClick={onCreateButtonClick}
		>
			Create
		</button>
	)
}

export default CreateButton
