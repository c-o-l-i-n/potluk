import FirebaseService, { _FirebaseServiceClassForTestingOnly } from '../services/firebase'
import * as FirebaseDatabase from 'firebase/database'
import { FirebaseOptions } from 'firebase/app'
import { Database, set, ref, DatabaseReference, remove } from 'firebase/database'
import Potluk, { PotlukDatabaseEntry } from '../types/potluk'
import Item from '../types/item'

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn().mockReturnValue({})
}))

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn().mockReturnValue({}),
  ref: jest.fn().mockReturnValue({}),
  set: jest.fn().mockReturnValue({}),
  remove: jest.fn().mockReturnValue({}),
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
  let databaseReference: DatabaseReference
  let itemId: string
  let itemCategoryIndex: number
  let item: Item
  let itemRef: DatabaseReference
  let lastModifiedRef: DatabaseReference
  let serverTimestampVal: number

  beforeEach(() => {
    firebaseOptions = {} as any
    reCaptchaSiteKey = 'abc'
    firebaseService = new _FirebaseServiceClassForTestingOnly(firebaseOptions, reCaptchaSiteKey)
    potlukId = 'PotlukID'
    potluk = { id: potlukId, toDatabaseEntry: () => potlukDatabaseEntry } as any
    potlukDatabaseEntry = {} as any
    databaseReference = {} as any
    itemId = 'ItemID'
    itemCategoryIndex = 3
    item = { id: itemId, categoryIndex: itemCategoryIndex } as any
    itemRef = {} as any
    lastModifiedRef = {} as any
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
      jest.spyOn(FirebaseDatabase, 'ref').mockReturnValue(databaseReference)
    })

    it('should create potluk in database', async () => {
      jest.spyOn(FirebaseDatabase, 'set').mockResolvedValue()

      await firebaseService.createPotlukInDatabase(potluk)

      expect(ref).toHaveBeenCalledTimes(1)
      expect(ref).toHaveBeenCalledWith(db, `potluks/${potlukId}`)

      expect(set).toHaveBeenCalledTimes(1)
      expect(set).toHaveBeenCalledWith(databaseReference, potlukDatabaseEntry)
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
})
