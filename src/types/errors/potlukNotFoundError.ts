export default class PotlukNotFoundError extends Error {
  constructor (potlukId: string) {
    super(`Cannot find Potluk with ID "${potlukId}"`)
    Object.setPrototypeOf(this, PotlukNotFoundError.prototype)
  }
}
