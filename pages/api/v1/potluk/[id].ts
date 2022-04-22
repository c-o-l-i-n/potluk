import db from '../../../../utils/db'

const putGetOrDeletePotluk = async (request: any, response: any) => {
	const { id } = request.query

	try {
		const potluksDatabase = db.ref('potluks')

		if (request.method === 'PUT') {
			await potluksDatabase.child(id).update({
				...request.body,
				lastModifiedDate: new Date(),
			})
		} else if (request.method === 'GET') {
			const potluk = (await potluksDatabase.child(id).get()).toJSON()

			if (!potluk) {
				response.status(404).end()
			}

			response.status(200).json(potluk)
		} else {
			response.status(405).end()
		}
	} catch (e) {
		console.error(e)
		response.status(500).end()
	}
}

export default putGetOrDeletePotluk
