import copy from 'copy-to-clipboard'

class _SharingService {
  public shareLink (title: string, url: string): void {
    this.share({ title, url })
  }

  public shareText (text: string): void {
    this.share({ text })
  }

  private share (data: ShareData): void {
    if (typeof navigator.canShare === 'function' && navigator.canShare(data)) {
      void navigator.share(data)
      return
    }

    const text = data.text ?? data.url

    if (typeof text !== 'string') {
      console.error(data)
      throw new Error('Share Data must contain a text or url field')
    }

    copy(text)
    alert('✅ Copied to clipboard')
  }
}

const SharingService = new _SharingService()

export default SharingService
export { _SharingService as _SharingServiceClassForTestingOnly }
