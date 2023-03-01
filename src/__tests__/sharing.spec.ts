import { _SharingServiceClassForTestingOnly } from '../services/sharing'
import copy from 'copy-to-clipboard'

jest.mock('copy-to-clipboard')

describe('sharing', () => {
  let sharingService: _SharingServiceClassForTestingOnly

  beforeEach(() => {
    sharingService = new _SharingServiceClassForTestingOnly()
  })

  afterEach(jest.resetAllMocks)

  it('should create', () => {
    expect(sharingService).toBeTruthy()
  })

  describe('browser can share', () => {
    beforeEach(() => {
      global.navigator.canShare = () => true
      global.navigator.share = async () => {}
      jest.spyOn(global.navigator, 'share')
    })

    it('should share link', () => {
      const title = 'Title'
      const url = 'http://potl.uk/PotlukID'

      sharingService.shareLink(title, url)

      expect(global.navigator.share).toHaveBeenCalledTimes(1)
      expect(global.navigator.share).toHaveBeenCalledWith({ title, url })
    })

    it('should share text', () => {
      const text = 'Hello there!'

      sharingService.shareText(text)

      expect(global.navigator.share).toHaveBeenCalledTimes(1)
      expect(global.navigator.share).toHaveBeenCalledWith({ text })
    })
  })

  describe('browser cannot share', () => {
    beforeEach(() => {
      global.navigator.canShare = () => false
      jest.spyOn(console, 'error').mockImplementation()
      jest.spyOn(window, 'alert').mockImplementation()
    })

    it('should copy link to clipboard', () => {
      const title = 'Title'
      const url = 'http://potl.uk/PotlukID'

      sharingService.shareLink(title, url)

      expect(copy).toHaveBeenCalledTimes(1)
      expect(copy).toHaveBeenCalledWith(url)
      expect(window.alert).toHaveBeenCalledTimes(1)
      expect(window.alert).toHaveBeenCalledWith('✅ Copied to clipboard')
    })

    it('should copy text to clipboard', () => {
      const text = 'Hello there!'

      sharingService.shareText(text)

      expect(copy).toHaveBeenCalledTimes(1)
      expect(copy).toHaveBeenCalledWith(text)
      expect(window.alert).toHaveBeenCalledTimes(1)
      expect(window.alert).toHaveBeenCalledWith('✅ Copied to clipboard')
    })

    it('should throw an error when text is not a string', () => {
      const number = 123

      // @ts-expect-error
      const func = (): void => sharingService.shareText(number)

      expect(func).toThrowError()
      expect(console.error).toHaveBeenCalledTimes(1)
    })
  })
})
