import db from '../../../../utils/db'

const postPotluk = async (request: any, response: any) => {
	try {
		const { id } = request.body
		const potluksDatabase = db.ref('potluks')
		await potluksDatabase.child(id).set(request.body)
		const newPotluk = await potluksDatabase.child(id).get()
		response.status(200).json(newPotluk)
	} catch (e) {
		console.error(e)
		response.status(500).end()
	}
}

export default postPotluk
