import UniqueID from '../types/uniqueId'

describe('uniqueId', () => {
  afterEach(jest.resetAllMocks)

  describe('constructor', () => {
    it('should generate a unique id upon construction', () => {
      const mockId = 'MockID'
      jest.spyOn(UniqueID, 'generateUniqueId').mockReturnValue(mockId)

      const cut = new UniqueID()

      expect(UniqueID.generateUniqueId).toBeCalledTimes(1)
      expect(cut.id).toBe(mockId)
    })
  })

  describe('generateUniqueId', () => {
    let expectedResult: string

    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0)
      jest.useFakeTimers().setSystemTime(new Date('2023-01-01'))
      expectedResult = 'TRcqSzQ0'
    })

    it('should generate a unique id based on the current time', () => {
      // results should not change when run at the same time, so both should be the same
      expect(UniqueID.generateUniqueId()).toEqual(expectedResult)
      expect(UniqueID.generateUniqueId()).toEqual(expectedResult)

      jest.advanceTimersByTime(1)
      const modifiedExpectedResult = 'TRcqSzR0'
      // advanced 1 letter for 1ms   ⬆

      // results should not change when run at the same time, so both should be the same
      expect(UniqueID.generateUniqueId()).toEqual(modifiedExpectedResult)
      expect(UniqueID.generateUniqueId()).toEqual(modifiedExpectedResult)
    })

    it('should make the last digit random', () => {
      // results should not change when run with same random result, so both should be the same
      expect(UniqueID.generateUniqueId()).toEqual(expectedResult)
      expect(UniqueID.generateUniqueId()).toEqual(expectedResult)

      jest.spyOn(Math, 'random').mockReturnValue(0.1)
      const modifiedExpectedResult1 = 'TRcqSzQ6'
      // change letter based on random result ⬆

      // results should not change when run with same random result, so both should be the same
      expect(UniqueID.generateUniqueId()).toEqual(modifiedExpectedResult1)
      expect(UniqueID.generateUniqueId()).toEqual(modifiedExpectedResult1)

      jest.spyOn(Math, 'random').mockReturnValue(0.2)
      const modifiedExpectedResult2 = 'TRcqSzQB'
      // change letter based on random result ⬆

      // results should not change when run with same random result, so both should be the same
      expect(UniqueID.generateUniqueId()).toEqual(modifiedExpectedResult2)
      expect(UniqueID.generateUniqueId()).toEqual(modifiedExpectedResult2)
    })
  })
})
