import Category from './category'
import UniqueID from './uniqueId'

export default class Potluk extends UniqueID {
	public createdDate: Date
	public lastModifiedDate: Date
	public eventName: string
	public eventDate: Date
	public categories: Category[]

	// cache the initial value so it doesn't parse a new value every single state change
	private static initialValueFromJson: Potluk;

	constructor(
		eventName: string,
		eventDate: Date,
		categories: Category[],
		id?: string,
		createdDate?: Date,
		lastModifiedDate?: Date
	) {
		super(id)
		const now = new Date()
		this.eventName = eventName
		this.eventDate = eventDate
		this.categories = categories
		this.createdDate = createdDate || now
		this.lastModifiedDate = lastModifiedDate || now
	}

	public static createFromJson = (json: any): Potluk => {
		// if rendering in client and already cached for this potluk, return cached value
		if (typeof window !== 'undefined' && Potluk.initialValueFromJson?.id === json.id) return Potluk.initialValueFromJson

		const { id, eventName } = json
		const eventDate = new Date(json.eventDate)
		const createdDate = new Date(json.createdDate)
		const lastModifiedDate = new Date(json.lastModifiedDate)

		const categories = Object.values(json.categories).map((categoryJson) =>
			Category.createFromJson(categoryJson as Category)
		)

		Potluk.initialValueFromJson = new Potluk(
			eventName,
			eventDate,
			categories,
			id,
			createdDate,
			lastModifiedDate
		)

		return Potluk.initialValueFromJson
	}

	public copy(): Potluk {
		return new Potluk(
			this.eventName,
			this.eventDate,
			this.categories,
			this.id,
			this.createdDate,
			this.lastModifiedDate
		)
	}
}
