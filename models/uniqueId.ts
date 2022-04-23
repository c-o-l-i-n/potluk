export default class UniqueID {
	public static readonly ID_LENGTH: number = 8
	public static readonly ID_ALPHABET: string =
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'

	public readonly id: string

	constructor(id?: string) {
		this.id = id || UniqueID.generateUniqueId()
	}

	private static generateUniqueId() {
		let id = ''
		for (let i = 0; i < UniqueID.ID_LENGTH; i++) {
			id += UniqueID.ID_ALPHABET.charAt(
				Math.floor(Math.random() * UniqueID.ID_ALPHABET.length)
			)
		}
		return id
	}
}
