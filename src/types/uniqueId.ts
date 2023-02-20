export default class UniqueID {
  // 62-character alphabet based on how Firebase alphabetizes keys
  private static readonly ALPHABET = '0123456789-ABCDEFGHIJKLMOPQRSTUVWXYZ_abcdefghijklmopqrstuvwxyz'
  private static readonly RADIX = UniqueID.ALPHABET.length

  public readonly id: string

  constructor (id?: string) {
    this.id = id ?? UniqueID.generateUniqueId()
  }

  /**
   * Create a unique ID by converting the current Unix time to string and
   * adding a random character at the end in the off chance of multiple IDs
   * being created during the same millisecond.
   *
   * This doesn't 100% guarantee that all IDs will be unique, but in order for
   * 2 IDs to be the same, they must both be created during the same exact
   * millisecond, and then there is a 1 in 62 (1.6%) chance of them both
   * getting the same random character. I am willing to take that risk.
   */
  public static generateUniqueId (): string {
    let unixTime = new Date().getTime()
    let id = ''
    let remainder: number

    // convert current Unix time to base-62 string
    while (unixTime > 0) {
      remainder = unixTime % UniqueID.RADIX
      unixTime -= remainder
      unixTime /= UniqueID.RADIX
      id = UniqueID.ALPHABET.charAt(remainder) + id
    }

    // add random character
    id += UniqueID.ALPHABET.charAt(Math.floor(Math.random() * UniqueID.RADIX))

    return id
  }
}
