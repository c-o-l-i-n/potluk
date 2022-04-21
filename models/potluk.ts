import Category from './category'

export default class Potluk {
	public static readonly ID_LENGTH: number = 8
	public static readonly ID_ALPHABET: string =
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'

	public id: string
	public createdDate: Date
	public lastModifiedDate: Date
	public eventName: string
	public eventDate: Date
	public categories: Category[]

	constructor(
		eventName: string,
		eventDate: Date,
		categories: Category[],
		id?: string,
		createdDate?: Date,
		lastModifiedDate?: Date
	) {
		const now = new Date()
		this.eventName = eventName
		this.eventDate = eventDate
		this.categories = categories
		this.id = id || Potluk.generateRandomId()
		this.createdDate = createdDate || now
		this.lastModifiedDate = lastModifiedDate || now
	}

	private static generateRandomId() {
		let id = ''
		for (let i = 0; i < Potluk.ID_LENGTH; i++) {
			id += Potluk.ID_ALPHABET.charAt(
				Math.floor(Math.random() * Potluk.ID_ALPHABET.length)
			)
		}
		return id
	}
}
