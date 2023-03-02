import FirebaseService, { _FirebaseServiceClassForTestingOnly } from '../services/firebase'
import { FirebaseOptions } from 'firebase/app'

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn().mockReturnValue({})
}))

jest.mock('firebase/database', () => ({
  getDatabase: jest.fn().mockReturnValue({})
}))

jest.mock('firebase/app-check')

describe('firebase', () => {
  let firebaseOptions: FirebaseOptions
  let reCaptchaSiteKey: string
  let firebaseService: _FirebaseServiceClassForTestingOnly

  beforeEach(() => {
    firebaseOptions = {} as any
    reCaptchaSiteKey = 'abc'
    firebaseService = new _FirebaseServiceClassForTestingOnly(firebaseOptions, reCaptchaSiteKey)
  })

  afterEach(jest.resetAllMocks)

  it('should create', () => {
    expect(firebaseService).toBeTruthy()
  })

  it('should create a singleton service', () => {
    expect(FirebaseService instanceof _FirebaseServiceClassForTestingOnly).toBe(true)
  })
})
