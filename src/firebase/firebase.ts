import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider, Unsubscribe } from 'firebase/app-check'
import { getDatabase, ref, push, set, onChildAdded, get, remove, onChildChanged, onChildRemoved, serverTimestamp, onValue } from 'firebase/database'
import { EventFunctions, ItemEventListener, ItemEventType } from '../types/itemEvent'
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

function subscribeToUpdates (
  potlukId: string,
  numberOfCategories: number,
  onAdd: ItemEventListener = console.log,
  onChange: ItemEventListener = console.log,
  onDelete: ItemEventListener = console.log,
  onConnectedStatusChange: (connected: boolean) => unknown
): () => void {
  const unsubs: Unsubscribe[] = []

  const eventFunctions: Record<ItemEventType, EventFunctions> = {
    [ItemEventType.ADD]: {
      firebaseEvent: onChildAdded,
      itemEventListener: onAdd
    },
    [ItemEventType.CHANGE]: {
      firebaseEvent: onChildChanged,
      itemEventListener: onChange
    },
    [ItemEventType.DELETE]: {
      firebaseEvent: onChildRemoved,
      itemEventListener: onDelete
    }
  }

  for (let categoryIndex = 0; categoryIndex < numberOfCategories; categoryIndex++) {
    const itemsRef = ref(db, `potluks/${potlukId}/categories/${categoryIndex}/items`)

    Object.entries(eventFunctions).forEach(([itemEventType, { firebaseEvent, itemEventListener }]) => {
      unsubs.push(firebaseEvent(itemsRef, snapshot => itemEventListener({
        type: itemEventType as ItemEventType,
        categoryIndex,
        itemId: snapshot.key ?? 'no-key',
        itemDatabaseEntry: snapshot.val()
      })))
    })
  }

  unsubs.push(onValue(ref(db, '.info/connected'), snapshot => onConnectedStatusChange(snapshot.val())))

  return () => unsubs.forEach(unsub => unsub())
}

async function createPotlukInDatabase (potluk: Potluk): Promise<void> {
  return await set(ref(db, `potluks/${potluk.id}`), potluk.toDatabaseEntry())
}

async function getPotlukFromDatabase (potlukId: string): Promise<Potluk> {
  const data = await (await get(ref(db, `potluks/${potlukId}`))).val()
  if (data === null) {
    throw new PotlukNotFoundError(potlukId)
  }
  return Potluk.createFromDatabaseEntry(potlukId, data)
}

function updateLastModified (potlukId: string): void {
  void set(ref(db, `potluks/${potlukId}/lastModified`), serverTimestamp())
}

function addItemToDatabase (potlukId: string, item: Item): void {
  void push(ref(db, `potluks/${potlukId}/categories/${item.categoryIndex}/items`), item.toDatabaseEntry())
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
  addItemToDatabase,
  deleteItemFromDatabase,
  bringOrUnbringItemInDatabase,
  changeItemNameInDatabase
}
