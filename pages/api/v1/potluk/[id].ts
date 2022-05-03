import db from '../../../../utils/db'

const putGetOrDeletePotluk = async (request: any, response: any) => {
	const { id } = request.query

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
					await potlukDatabaseReference.update(request.body)
					break

				default:
					response.status(405).end()
					break
			}

			// update lastModifiedDate
			await potlukDatabaseReference.child('lastModifiedDate').update(new Date())

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
