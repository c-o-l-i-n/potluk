import { NextApiRequest, NextApiResponse } from 'next'
import Potluk from '../../../../models/potluk'
import db from '../../../../utils/db/firebase-admin'

const postPotluk = async (request: NextApiRequest, response: NextApiResponse) => {
	const potluk: Potluk = JSON.parse(request.body)

	// set proper category indeces
	potluk.categories.forEach((category, index) => category.index = index)

	try {
		const potluksDatabase = db.ref('potluks')
		await potluksDatabase.child(potluk.id).set(potluk)
		const newPotluk = await potluksDatabase.child(potluk.id).get()
		response.status(200).json(newPotluk)
	} catch (e) {
		console.error(e)
		response.status(500).end()
	}
}

export default postPotluk
