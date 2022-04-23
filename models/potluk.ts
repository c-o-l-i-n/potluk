import Category from './category'
import UniqueID from './uniqueId'

export default class Potluk extends UniqueID {
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
		super(id)
		const now = new Date()
		this.eventName = eventName
		this.eventDate = eventDate
		this.categories = categories
		this.createdDate = createdDate || now
		this.lastModifiedDate = lastModifiedDate || now
	}

	public static createFromJson = (json: any): Potluk => {
		const { id, eventName } = json
		const eventDate = new Date(json.eventDate)
		const createdDate = new Date(json.createdDate)
		const lastModifiedDate = new Date(json.lastModifiedDate)

		const categories = Object.values(json.categories).map((categoryJson) =>
			Category.createFromJson(categoryJson)
		)

		return new Potluk(
			eventName,
			eventDate,
			categories,
			id,
			createdDate,
			lastModifiedDate
		)
	}
}
