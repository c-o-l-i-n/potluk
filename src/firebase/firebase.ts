import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider, Unsubscribe } from 'firebase/app-check'
import { getDatabase, ref, DataSnapshot, push, set, onChildAdded, get, onValue, remove, DatabaseReference } from 'firebase/database'
import ItemEvent from '../types/itemEvent'
import Item from '../types/item'
import Potluk from '../types/potluk'
import PotlukNotFoundError from '../types/errors/potlukNotFoundError'

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

const db = getDatabase(app)
const eventsRef = (potlukId: string): DatabaseReference => ref(db, `potluks/${potlukId}/events`)

function subscribeToUpdates (potlukId: string, callbackFn: (snapshot: DataSnapshot) => void): Unsubscribe {
  let initialDataLoaded = false
  const unsub = onValue(eventsRef(potlukId), () => {
    initialDataLoaded = true
    unsub()
  })
  return onChildAdded(eventsRef(potlukId), (snapshot) => {
    if (initialDataLoaded) {
      callbackFn(snapshot)
    }
  })
}

async function createPotlukInDatabase (potluk: Potluk): Promise<void> {
  const serializedPotluk = JSON.parse(JSON.stringify(potluk))
  delete serializedPotluk.id
  serializedPotluk.date = potluk.date.toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  return await set(ref(db, `potluks/${potluk.id}`), serializedPotluk)
}

async function getPotlukFromDatabase (potlukId: string): Promise<Potluk> {
  const data = await (await get(ref(db, `potluks/${potlukId}`))).val()
  if (data === null) {
    throw new PotlukNotFoundError(potlukId)
  }
  return Potluk.createFromDatabaseEntry(potlukId, data)
}

function updateLastModified (potlukId: string): void {
  void set(ref(db, `potluks/${potlukId}/lastModified`), new Date().toISOString())
}

function publishItemEvent (potlukId: string, event: ItemEvent): void {
  void set(push(eventsRef(potlukId)), event)
}

function addItemToDatabase (potlukId: string, item: Item): void {
  void set(ref(db, `potluks/${potlukId}/categories/${item.categoryIndex}/items/${item.id}`), item.toDatabaseEntry())
  updateLastModified(potlukId)
}

function deleteItemFromDatabase (potlukId: string, item: Item): void {
  void remove(ref(db, `potluks/${potlukId}/categories/${item.categoryIndex}/items/${item.id}`))
  updateLastModified(potlukId)
}

function bringOrUnbringItemInDatabase (potlukId: string, item: Item, username: string, bring: boolean): void {
  void set(ref(db, `potluks/${potlukId}/categories/${item.categoryIndex}/items/${item.id}/broughtBy`), bring ? username : null)
  updateLastModified(potlukId)
}

function changeItemNameInDatabase (potlukId: string, item: Item, name: string): void {
  void set(ref(db, `potluks/${potlukId}/categories/${item.categoryIndex}/items/${item.id}/name`), name)
  updateLastModified(potlukId)
}

export {
  subscribeToUpdates,
  createPotlukInDatabase,
  getPotlukFromDatabase,
  publishItemEvent,
  addItemToDatabase,
  deleteItemFromDatabase,
  bringOrUnbringItemInDatabase,
  changeItemNameInDatabase
}
