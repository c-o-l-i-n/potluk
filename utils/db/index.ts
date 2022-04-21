import admin, { ServiceAccount } from 'firebase-admin'
import serviceAccount from './serviceAccountKey.json'

if (!admin.apps.length) {
	try {
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount as ServiceAccount),
			databaseURL: 'https://potluk-app-default-rtdb.firebaseio.com',
		})
	} catch (error: any) {
		console.log('Firebase admin initialization error', error.toString())
	}
}
export default admin.database()
