import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { getDatabase, ref, DataSnapshot, push, set, onChildAdded, get, onValue, remove } from 'firebase/database'
import { getAuth, signInAnonymously } from 'firebase/auth'
import ItemEvent from '../models/itemEvent'
import Item from '../models/item'

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

// Initialize App Check security
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LcvdtQfAAAAAKbmKpb68MIZt5GXZYubca1YLV-5'),
  isTokenAutoRefreshEnabled: true
});

const auth = getAuth(app)
const db = getDatabase(app)
const eventsRef = (potlukId: string) => ref(db, `potluks/${potlukId}/events`)

const signIntoFirebase = async () => {
	await signInAnonymously(auth)
}

const subscribeToUpdates = (
	potlukId: string,
	callbackFn: (snapshot: DataSnapshot) => void
) => {
	let initialDataLoaded = false;
	const unsub = onValue(eventsRef(potlukId), () => {initialDataLoaded = true})
	return onChildAdded(eventsRef(potlukId), (snapshot) => {
		if (initialDataLoaded) {
			unsub()
			callbackFn(snapshot)
		}
	})
}

const udpateLastModifiedDate = (potlukId: string): void => {
	set(ref(db, `potluks/${potlukId}/lastModifiedDate`), new Date().toISOString())
}

const publishItemEvent = (potlukId: string, event: ItemEvent): void => {
	set(push(eventsRef(potlukId)), event)
}

const getPotlukJson = async (potlukId: string) => {
	const potlukRef = ref(db, `potluks/${potlukId}`)
	return (await get(potlukRef)).toJSON()
}

const addItemToDatabase = (potlukId: string, item: Item): void => {
	set(ref(db, `potluks/${potlukId}/categories/${item.categoryIndex}/items/${item.id}`), item)
	udpateLastModifiedDate(potlukId)
}

const deleteItemFromDatabase = (potlukId: string, item: Item): void => {
	remove(ref(db, `potluks/${potlukId}/categories/${item.categoryIndex}/items/${item.id}`))
	udpateLastModifiedDate(potlukId)
}

const bringOrUnbringItemInDatabase = (potlukId: string, item: Item, username: string, bring: boolean): void => {
	set(ref(db, `potluks/${potlukId}/categories/${item.categoryIndex}/items/${item.id}/broughtByUser`), bring ? username : null)
	udpateLastModifiedDate(potlukId)
}

const changeItemNameInDatabase = (potlukId: string, item: Item, name: string): void => {
	set(ref(db, `potluks/${potlukId}/categories/${item.categoryIndex}/items/${item.id}/name`), name)
	udpateLastModifiedDate(potlukId)
}

export {
	signIntoFirebase,
	subscribeToUpdates,
	publishItemEvent,
	addItemToDatabase,
	getPotlukJson,
	deleteItemFromDatabase,
	bringOrUnbringItemInDatabase,
	changeItemNameInDatabase
}
