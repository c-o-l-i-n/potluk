import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider, Unsubscribe } from 'firebase/app-check'
import { getDatabase, ref, DataSnapshot, push, set, onChildAdded, get, onValue, remove, DatabaseReference } from 'firebase/database'
import { getAuth, signInAnonymously } from 'firebase/auth'
import ItemEvent from '../types/itemEvent'
import Item from '../types/item'
import Potluk from '../types/potluk'

// Initialize Firebase
const app = initializeApp({
  apiKey: 'AIzaSyAMyXwyJZUup4zi-ENY5q2Y8ze_79Ck_vg',
  authDomain: 'potluk-app.firebaseapp.com',
  databaseURL: 'https://potluk-app-default-rtdb.firebaseio.com',
  projectId: 'potluk-app',
  storageBucket: 'potluk-app.appspot.com',
  messagingSenderId: '209562255019',
  appId: '1:209562255019:web:4df88c5e816b6c865581ee',
  measurementId: 'G-5NDQE97HZ9'
})

// Initialize App Check security (for frontend only)
typeof window === 'object' && initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LcvdtQfAAAAAKbmKpb68MIZt5GXZYubca1YLV-5'),
  isTokenAutoRefreshEnabled: true
})

const auth = getAuth(app)
const db = getDatabase(app)
const eventsRef = (potlukId: string): DatabaseReference => ref(db, `potluks/${potlukId}/events`)

const signIntoFirebase = async (): Promise<void> => {
  await signInAnonymously(auth)
}

const subscribeToUpdates = (
  potlukId: string,
  callbackFn: (snapshot: DataSnapshot) => void
): Unsubscribe => {
  let initialDataLoaded = false
  const unsub = onValue(eventsRef(potlukId), () => { initialDataLoaded = true })
  return onChildAdded(eventsRef(potlukId), (snapshot) => {
    if (initialDataLoaded) {
      unsub()
      callbackFn(snapshot)
    }
  })
}

const createPotlukInDatabase = async (potluk: Potluk): Promise<void> => {
  const serializedPotluk = JSON.parse(JSON.stringify(potluk))
  delete serializedPotluk.id
  serializedPotluk.date = potluk.date.toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  return await set(ref(db, `potluks/${potluk.id}`), serializedPotluk)
}

const getPotlukFromDatabase = async (potlukId: string): Promise<Potluk> => {
  const data = await (await get(ref(db, `potluks/${potlukId}`))).val()
  if (data === null) {
    throw new Error(`Cannot find Potluk with ID "${potlukId}"`)
  }
  return Potluk.createFromJson(potlukId, data)
}

const updateLastModified = (potlukId: string): void => {
  void set(ref(db, `potluks/${potlukId}/lastModified`), new Date().toISOString())
}

const publishItemEvent = (potlukId: string, event: ItemEvent): void => {
  void set(push(eventsRef(potlukId)), event)
}

const getPotlukJson = async (potlukId: string): Promise<object | null> => {
  const potlukRef = ref(db, `potluks/${potlukId}`)
  return (await get(potlukRef)).toJSON()
}

const cleansedItem = (item: Item): Object => (
  JSON.parse(
    JSON.stringify({
      ...item,
      id: undefined,
      categoryIndex: undefined
    })
  )
)

const addItemToDatabase = (potlukId: string, item: Item): void => {
  void set(ref(db, `potluks/${potlukId}/categories/${item.categoryIndex}/items/${item.id}`), cleansedItem(item))
  updateLastModified(potlukId)
}

const deleteItemFromDatabase = (potlukId: string, item: Item): void => {
  void remove(ref(db, `potluks/${potlukId}/categories/${item.categoryIndex}/items/${item.id}`))
  updateLastModified(potlukId)
}

const bringOrUnbringItemInDatabase = (potlukId: string, item: Item, username: string, bring: boolean): void => {
  void set(ref(db, `potluks/${potlukId}/categories/${item.categoryIndex}/items/${item.id}/broughtBy`), bring ? username : null)
  updateLastModified(potlukId)
}

const changeItemNameInDatabase = (potlukId: string, item: Item, name: string): void => {
  void set(ref(db, `potluks/${potlukId}/categories/${item.categoryIndex}/items/${item.id}/name`), name)
  updateLastModified(potlukId)
}

export {
  signIntoFirebase,
  subscribeToUpdates,
  createPotlukInDatabase,
  getPotlukFromDatabase,
  publishItemEvent,
  addItemToDatabase,
  getPotlukJson,
  deleteItemFromDatabase,
  bringOrUnbringItemInDatabase,
  changeItemNameInDatabase
}
