import firebase, { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, DataSnapshot } from 'firebase/database'
import { getAuth, signInAnonymously } from 'firebase/auth'

// Initialize Firebase
const app = initializeApp({
	apiKey: 'AIzaSyAMyXwyJZUup4zi-ENY5q2Y8ze_79Ck_vg',
	authDomain: 'potluk-app.firebaseapp.com',
	databaseURL: 'https://potluk-app-default-rtdb.firebaseio.com',
	projectId: 'potluk-app',
	storageBucket: 'potluk-app.appspot.com',
	messagingSenderId: '209562255019',
	appId: '1:209562255019:web:4df88c5e816b6c865581ee',
	measurementId: 'G-5NDQE97HZ9',
})

const auth = getAuth(app)
const db = getDatabase(app)

const signIntoFirebase = async () => {
	await signInAnonymously(auth)
}

const subscribeToUpdates = (
	potlukId: string,
	callbackFn: (snapshot: DataSnapshot) => void
) => onValue(ref(db, `potluks/${potlukId}`), callbackFn)

export { signIntoFirebase, subscribeToUpdates }
