import FirebaseService, { _FirebaseServiceClassForTestingOnly } from '../services/firebase'
import * as FirebaseDatabase from 'firebase/database'
import { FirebaseOptions } from 'firebase/app'
import { Database, set, ref, push, DatabaseReference, remove, onDisconnect, DataSnapshot, OnDisconnect } from 'firebase/database'
import Potluk, { PotlukDatabaseEntry } from '../types/potluk'
import Item, { ItemDatabaseEntry } from '../types/item'
import PotlukNotFoundError from '../types/errors/potlukNotFoundError'

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn().mockReturnValue({})
}))

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn().mockReturnValue({}),
  ref: jest.fn().mockReturnValue({}),
  get: jest.fn().mockReturnValue({}),
  set: jest.fn().mockReturnValue({}),
  push: jest.fn().mockReturnValue({}),
  remove: jest.fn().mockReturnValue({}),
  onDisconnect: jest.fn().mockReturnValue({}),
  serverTimestamp: jest.fn().mockReturnValue({})
}))

jest.mock('firebase/app-check')

jest.mock('../types/potluk')

describe('firebase', () => {
  let firebaseOptions: FirebaseOptions
  let reCaptchaSiteKey: string
  let firebaseService: _FirebaseServiceClassForTestingOnly
  let db: Database
  let potlukId: string
  let potluk: Potluk
  let potlukDatabaseEntry: PotlukDatabaseEntry
  let potlukSnapshot: DataSnapshot
  let nullSnapshot: DataSnapshot
  let potlukRef: DatabaseReference
  let itemId: string
  let itemCategoryIndex: number
  let item: Item
  let itemDatabaseEntry: ItemDatabaseEntry
  let itemRef: DatabaseReference
  let itemOnDisconnect: OnDisconnect
  let lastModifiedRef: DatabaseReference
  let serverTimestampVal: number

  beforeEach(() => {
    firebaseOptions = { firebaseOptions: 1 } as any
    reCaptchaSiteKey = 'abc'
    firebaseService = new _FirebaseServiceClassForTestingOnly(firebaseOptions, reCaptchaSiteKey)
    potlukId = 'PotlukID'
    potluk = { id: potlukId, toDatabaseEntry: () => potlukDatabaseEntry } as any
    potlukDatabaseEntry = { potlukDatabaseEntry: 1 } as any
    potlukSnapshot = { val: () => potlukDatabaseEntry } as any
    nullSnapshot = { val: () => null } as any
    potlukRef = { potlukRef: 1 } as any
    itemId = 'ItemID'
    itemCategoryIndex = 3
    itemDatabaseEntry = { itemDatabaseEntry: 1 } as any
    item = { id: itemId, categoryIndex: itemCategoryIndex, toDatabaseEntry: () => itemDatabaseEntry } as any
    itemRef = { itemRef: 1 } as any
    itemOnDisconnect = { remove: () => {} } as any
    lastModifiedRef = { lastModifiedRef: 1 } as any
    serverTimestampVal = 1234

    // eslint-disable-next-line
    db = firebaseService['db']

    jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(jest.resetAllMocks)

  it('should create', () => {
    expect(firebaseService).toBeTruthy()
  })

  it('should create a singleton service', () => {
    expect(FirebaseService instanceof _FirebaseServiceClassForTestingOnly).toBe(true)
  })

  describe('createPotlukInDatabase', () => {
    beforeEach(() => {
      jest.spyOn(potluk, 'toDatabaseEntry')
      jest.spyOn(FirebaseDatabase, 'ref').mockReturnValue(potlukRef)
    })

    it('should create potluk in database', async () => {
      jest.spyOn(FirebaseDatabase, 'set').mockResolvedValue()

      await firebaseService.createPotlukInDatabase(potluk)

      expect(ref).toHaveBeenCalledTimes(1)
      expect(ref).toHaveBeenCalledWith(db, `potluks/${potlukId}`)

      expect(set).toHaveBeenCalledTimes(1)
      expect(set).toHaveBeenCalledWith(potlukRef, potlukDatabaseEntry)
    })

    it('should throw error', async () => {
      const expectedError = 'error :('
      jest.spyOn(FirebaseDatabase, 'set').mockRejectedValue(expectedError)

      let actualError: unknown

      try {
        await firebaseService.createPotlukInDatabase(potluk)
      } catch (err) {
        actualError = err
      }

      expect(actualError).toBe(expectedError)
    })
  })

  describe('getPotlukFromDatabase', () => {
    beforeEach(() => {
      jest.spyOn(FirebaseDatabase, 'ref').mockReturnValue(potlukRef)
    })

    describe('potluk with given id exists', () => {
      let returnedPotluk: Potluk

      beforeEach(async () => {
        jest.spyOn(FirebaseDatabase, 'get').mockResolvedValue(potlukSnapshot)

        jest.spyOn(Potluk, 'createFromDatabaseEntry').mockImplementation(
          (potlukIdArg: string, data: PotlukDatabaseEntry) => {
            if (potlukIdArg === potlukId && data === potlukDatabaseEntry) {
              return potluk
            }
            fail()
          })

        returnedPotluk = await firebaseService.getPotlukFromDatabase(potlukId)
      })

      it('should query the correct database enpoint', () => {
        expect(ref).toBeCalledTimes(1)
        expect(ref).toBeCalledWith(db, `potluks/${potlukId}`)
      })

      it('should return correct potluk from database when it exists', async () => {
        expect(returnedPotluk).toBe(potluk)
      })
    })

    describe('potluk with given id does NOT exist', () => {
      let errorThrown: unknown

      beforeEach(async () => {
        jest.spyOn(FirebaseDatabase, 'get').mockResolvedValue(nullSnapshot)

        try {
          await firebaseService.getPotlukFromDatabase(potlukId)
        } catch (err) {
          errorThrown = err
        }
      })

      it('should query the correct database enpoint', () => {
        expect(ref).toBeCalledTimes(1)
        expect(ref).toBeCalledWith(db, `potluks/${potlukId}`)
      })

      it('should throw proper error when potluk with given id does not exist', () => {
        expect(errorThrown instanceof PotlukNotFoundError).toBe(true)
      })
    })
  })

  describe('addItemToDatabase', () => {
    beforeEach(() => {
      jest.spyOn(FirebaseDatabase, 'ref').mockReturnValueOnce(itemRef)
      jest.spyOn(FirebaseDatabase, 'ref').mockReturnValueOnce(lastModifiedRef)
    })

    describe('success', () => {
      beforeEach(async () => {
        jest.spyOn(FirebaseDatabase, 'push').mockResolvedValue(itemRef)
        jest.spyOn(FirebaseDatabase, 'set').mockResolvedValue()
        jest.spyOn(FirebaseDatabase, 'onDisconnect').mockReturnValue(itemOnDisconnect)
        jest.spyOn(itemOnDisconnect, 'remove').mockReturnValue(Promise.resolve())
        jest.spyOn(FirebaseDatabase, 'serverTimestamp').mockReturnValue(serverTimestampVal as any)

        firebaseService.addItemToDatabase(potlukId, item)

        // await all promises
        await new Promise(process.nextTick)
      })

      it('should add item to database', async () => {
        expect(ref).toHaveBeenCalledWith(db, `potluks/${potlukId}/c/${itemCategoryIndex}/i`)
        expect(push).toHaveBeenCalledTimes(1)
        expect(push).toHaveBeenCalledWith(itemRef, itemDatabaseEntry)
      })

      it('should remove item on disconnect', async () => {
        expect(onDisconnect).toHaveBeenCalledTimes(1)
        expect(onDisconnect).toHaveBeenCalledWith(itemRef)
        expect(itemOnDisconnect.remove).toBeCalledTimes(1)
      })

      it('should update last modified in database', async () => {
        expect(ref).toHaveBeenCalledWith(db, `potluks/${potlukId}/m`)
        expect(set).toHaveBeenCalledTimes(1)
        expect(set).toHaveBeenCalledWith(lastModifiedRef, serverTimestampVal)
      })
    })

    describe('fail', () => {
      let expectedError: string

      beforeEach(async () => {
        expectedError = 'error :('
        jest.spyOn(FirebaseDatabase, 'push').mockRejectedValue(expectedError)

        firebaseService.addItemToDatabase(potlukId, item)
      })

      it('should handle error', async () => {
        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(expectedError)
      })

      it('should NOT update last modified in database', async () => {
        expect(ref).not.toHaveBeenCalledWith(db, `potluks/${potlukId}/m`)
        expect(set).not.toHaveBeenCalledWith(lastModifiedRef, serverTimestampVal)
      })
    })
  })

  describe('deleteItemFromDatabase', () => {
    beforeEach(() => {
      jest.spyOn(FirebaseDatabase, 'ref').mockReturnValueOnce(itemRef)
      jest.spyOn(FirebaseDatabase, 'ref').mockReturnValueOnce(lastModifiedRef)
    })

    describe('success', () => {
      beforeEach(async () => {
        jest.spyOn(FirebaseDatabase, 'remove').mockResolvedValue()
        jest.spyOn(FirebaseDatabase, 'set').mockResolvedValue()
        jest.spyOn(FirebaseDatabase, 'serverTimestamp').mockReturnValue(serverTimestampVal as any)

        firebaseService.deleteItemFromDatabase(potlukId, item)

        // await all promises
        await new Promise(process.nextTick)
      })

      it('should delete item from database', async () => {
        expect(ref).toHaveBeenCalledWith(db, `potluks/${potlukId}/c/${itemCategoryIndex}/i/${itemId}`)
        expect(remove).toHaveBeenCalledTimes(1)
        expect(remove).toHaveBeenCalledWith(itemRef)
      })

      it('should update last modified in database', async () => {
        expect(ref).toHaveBeenCalledWith(db, `potluks/${potlukId}/m`)
        expect(set).toHaveBeenCalledTimes(1)
        expect(set).toHaveBeenCalledWith(lastModifiedRef, serverTimestampVal)
      })
    })

    describe('fail', () => {
      let expectedError: string

      beforeEach(async () => {
        expectedError = 'error :('
        jest.spyOn(FirebaseDatabase, 'remove').mockRejectedValue(expectedError)

        firebaseService.deleteItemFromDatabase(potlukId, item)
      })

      it('should handle error', async () => {
        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(expectedError)
      })

      it('should NOT update last modified in database', async () => {
        expect(ref).not.toHaveBeenCalledWith(db, `potluks/${potlukId}/m`)
        expect(set).not.toHaveBeenCalledWith(lastModifiedRef, serverTimestampVal)
      })
    })
  })

  describe('bringOrUnbringItemInDatabase', () => {
    let username: string
    let bring: boolean

    beforeEach(() => {
      username = 'Colin Williams'

      jest.spyOn(FirebaseDatabase, 'ref').mockReturnValueOnce(itemRef)
      jest.spyOn(FirebaseDatabase, 'ref').mockReturnValueOnce(lastModifiedRef)
    })

    describe('success', () => {
      beforeEach(async () => {
        jest.spyOn(FirebaseDatabase, 'set').mockResolvedValue()
        jest.spyOn(FirebaseDatabase, 'serverTimestamp').mockReturnValue(serverTimestampVal as any)

        // await all promises
        await new Promise(process.nextTick)
      })

      describe('bring', () => {
        beforeEach(() => {
          bring = true

          firebaseService.bringOrUnbringItemInDatabase(potlukId, item, username, bring)
        })

        it('should set user as bringing item in database', async () => {
          expect(ref).toHaveBeenCalledWith(db, `potluks/${potlukId}/c/${itemCategoryIndex}/i/${itemId}/b`)
          expect(set).toHaveBeenCalledWith(itemRef, username)
        })

        it('should update last modified in database', async () => {
          expect(ref).toHaveBeenCalledWith(db, `potluks/${potlukId}/m`)
          expect(set).toHaveBeenCalledTimes(2)
          expect(set).toHaveBeenCalledWith(lastModifiedRef, serverTimestampVal)
        })
      })

      describe('bring', () => {
        beforeEach(() => {
          bring = false

          firebaseService.bringOrUnbringItemInDatabase(potlukId, item, username, bring)
        })

        it('should set user as bringing item in database', async () => {
          expect(ref).toHaveBeenCalledWith(db, `potluks/${potlukId}/c/${itemCategoryIndex}/i/${itemId}/b`)
          expect(set).toHaveBeenCalledWith(itemRef, null)
        })

        it('should update last modified in database', async () => {
          expect(ref).toHaveBeenCalledWith(db, `potluks/${potlukId}/m`)
          expect(set).toHaveBeenCalledTimes(2)
          expect(set).toHaveBeenCalledWith(lastModifiedRef, serverTimestampVal)
        })
      })
    })

    describe('fail', () => {
      let expectedError: string

      beforeEach(async () => {
        expectedError = 'error :('
        jest.spyOn(FirebaseDatabase, 'set').mockRejectedValue(expectedError)

        firebaseService.bringOrUnbringItemInDatabase(potlukId, item, username, bring)
      })

      it('should handle error', async () => {
        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.error).toHaveBeenCalledWith(expectedError)
      })

      it('should NOT update last modified in database', async () => {
        expect(ref).not.toHaveBeenCalledWith(db, `potluks/${potlukId}/m`)
        expect(set).not.toHaveBeenCalledWith(lastModifiedRef, serverTimestampVal)
      })
    })
  })
})
