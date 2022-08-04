import Potluk from '../../../../models/potluk'
import db from '../../../../utils/db/firebase-admin'

const postPotluk = async (request: any, response: any) => {
	const potluk = new Potluk(
		request.body.eventName,
		request.body.eventDate,
		request.body.categories,
		request.body.id,
		request.body.createdDate,
		request.body.lastModifiedDate
	)

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
