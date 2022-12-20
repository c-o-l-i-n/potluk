import { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../../utils/db/firebase-admin'

const putGetOrDeletePotluk = async (request: NextApiRequest, response: NextApiResponse) => {
	const id = request.query['id'] as string

	try {
		const potlukDatabaseReference = db.ref('potluks').child(id)

		if (request.method === 'GET') {
			const potluk = (await potlukDatabaseReference.get()).toJSON()

			if (!potluk) {
				response.status(404).end()
			}
			response.status(200).json(potluk)
		} else {
			switch (request.method) {
				case 'PUT':
					await potlukDatabaseReference.update({
						...request.body,
						lastModifiedDate: new Date(),
					})
					break

				default:
					response.status(405).end()
					break
			}

			// return updated potluk
			const updatedPotluk = await potlukDatabaseReference.get()
			response.status(200).json(updatedPotluk)
		}
	} catch (e) {
		console.error(e)
		response.status(500).end()
	}
}

export default putGetOrDeletePotluk
