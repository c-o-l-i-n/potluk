import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider, Unsubscribe } from 'firebase/app-check'
import { getDatabase, ref, push, set, onChildAdded, get, remove, onChildChanged, onChildRemoved, serverTimestamp, onValue, Database, onDisconnect } from 'firebase/database'
import { EventFunctions, ItemEventListener, ItemEventType } from '../types/itemEvent'
import Item from '../types/item'
import Potluk from '../types/potluk'
import PotlukNotFoundError from '../types/errors/potlukNotFoundError'
import { toast } from 'react-hot-toast'

class FirebaseService {
  private readonly app: FirebaseApp
  private readonly db: Database

  constructor (firebaseOptions: FirebaseOptions, reCaptchaSiteKey: string) {
    this.app = initializeApp(firebaseOptions)
    this.db = getDatabase(this.app)

    // Initialize App Check security (for frontend only)
    typeof window === 'object' && initializeAppCheck(this.app, {
      provider: new ReCaptchaV3Provider(reCaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    })
  }

  public subscribeToUpdates (
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
      const itemsRef = ref(this.db, `potluks/${potlukId}/c/${categoryIndex}/i`)

      Object.entries(eventFunctions).forEach(([itemEventType, { firebaseEvent, itemEventListener }]) => {
        unsubs.push(firebaseEvent(itemsRef, snapshot => itemEventListener({
          type: itemEventType as ItemEventType,
          categoryIndex,
          itemId: snapshot.key ?? 'no-key',
          itemDatabaseEntry: snapshot.val()
        })))
      })
    }

    unsubs.push(onValue(ref(this.db, '.info/connected'), snapshot => onConnectedStatusChange(snapshot.val())))

    return () => unsubs.forEach(unsub => unsub())
  }

  public async createPotlukInDatabase (potluk: Potluk): Promise<void> {
    return await set(ref(this.db, `potluks/${potluk.id}`), potluk.toDatabaseEntry())
      .catch(err => this.handleError(err, true))
  }

  // we don't handle errors here because the error should show the "Unexpected Error" page instead of a toast
  public async getPotlukFromDatabase (potlukId: string): Promise<Potluk> {
    const data = await (await get(ref(this.db, `potluks/${potlukId}`))).val()
    if (data === null) {
      throw new PotlukNotFoundError(potlukId)
    }
    return Potluk.createFromDatabaseEntry(potlukId, data)
  }

  public addItemToDatabase (potlukId: string, item: Item): void {
    void push(ref(this.db, `potluks/${potlukId}/c/${item.categoryIndex}/i`), item.toDatabaseEntry())
      .then((itemRef) => {
        this.updateLastModified(potlukId)

        // remove item on disconnect (if it is blank)
        void onDisconnect(itemRef).remove()
      })
      .catch(this.handleError)
  }

  public deleteItemFromDatabase (potlukId: string, item: Item): void {
    void remove(ref(this.db, `potluks/${potlukId}/c/${item.categoryIndex}/i/${item.id}`))
      .then(() => this.updateLastModified(potlukId))
      .catch(this.handleError)
  }

  public bringOrUnbringItemInDatabase (potlukId: string, item: Item, username: string, bring: boolean): void {
    void set(ref(this.db, `potluks/${potlukId}/c/${item.categoryIndex}/i/${item.id}/b`), bring ? username : null)
      .then(() => this.updateLastModified(potlukId))
      .catch(this.handleError)
  }

  public changeItemNameInDatabase (potlukId: string, item: Item, name: string): void {
    const itemNameRef = ref(this.db, `potluks/${potlukId}/c/${item.categoryIndex}/i/${item.id}/n`)
    const itemRef = itemNameRef.parent

    void set(itemNameRef, name)
      .then(() => {
        this.updateLastModified(potlukId)

        if (itemRef === null) {
          console.error(itemNameRef)
          throw new Error('Unexpected error: item name parent is null (should be the item itself)')
        }

        // if blank, remove on disconnect. else, cancel removal on disconnect
        void onDisconnect(itemRef)[name === '' ? 'remove' : 'cancel']()
      })
      .catch(this.handleError)
  }

  private updateLastModified (potlukId: string): void {
    void set(ref(this.db, `potluks/${potlukId}/m`), serverTimestamp())
      .catch(this.handleError)
  }

  private handleError (err: unknown, shouldThrowError = false): void {
    toast.error('Error. Please try again later.')
    if (shouldThrowError) { throw err }
    console.error(err)
  }
}

export default new FirebaseService({
  apiKey: 'AIzaSyAMyXwyJZUup4zi-ENY5q2Y8ze_79Ck_vg',
  authDomain: 'potluk-app.firebaseapp.com',
  databaseURL: 'https://potluk-app-default-rtdb.firebaseio.com',
  projectId: 'potluk-app',
  storageBucket: 'potluk-app.appspot.com',
  messagingSenderId: '209562255019',
  appId: '1:209562255019:web:4df88c5e816b6c865581ee',
  measurementId: 'G-5NDQE97HZ9'
}, '6LcvdtQfAAAAAKbmKpb68MIZt5GXZYubca1YLV-5')
