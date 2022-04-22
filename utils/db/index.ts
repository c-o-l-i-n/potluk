import admin from 'firebase-admin'

if (!admin.apps.length) {
	try {
		console.log(process.env.FIREBASE_CREDENTIALS_WITHOUT_API_KEY)
		console.log(process.env.API_KEY)

		const firebaseCredentials = {
			...JSON.parse(process.env.FIREBASE_CREDENTIALS_WITHOUT_API_KEY || ''),
			privateKey: process.env.API_KEY?.replace(/\\n/g, '\n'),
		}

		console.log(firebaseCredentials)

		admin.initializeApp({
			credential: admin.credential.cert(firebaseCredentials),
			databaseURL: `https://${process.env.DATABASE_NAME}.firebaseio.com`,
		})
	} catch (error: any) {
		console.log('Firebase admin initialization error', error.toString())
	}
}
export default admin.database()
