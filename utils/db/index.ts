import admin from 'firebase-admin'

if (!admin.apps.length) {
	try {
		const firebaseCredentials = {
			...JSON.parse(process.env.FIREBASE_CREDENTIALS_WITHOUT_API_KEY || ''),
			privateKey: process.env.API_KEY?.replace(/\\n/g, '\n'),
		}

		admin.initializeApp({
			credential: admin.credential.cert(firebaseCredentials),
			databaseURL: `https://${process.env.DATABASE_NAME}.firebaseio.com`,
		})
	} catch (error: any) {
		console.error('Firebase admin initialization error', error.toString())
	}
}
export default admin.database()
