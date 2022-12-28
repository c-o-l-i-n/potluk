import Category from './category'
import UniqueID from './uniqueId'

export default class Potluk extends UniqueID {
	public lastModified: Date
	public name: string
	public date: Date
	public categories: Category[]

	constructor(
		name: string,
		date: Date,
		categories: Category[],
		id?: string,
		lastModified?: Date
	) {
		super(id)
		this.name = name
		this.date = date
		this.categories = categories
		this.lastModified = lastModified || new Date()
	}

	public static createFromJson = (id: string, json: Potluk): Potluk => {
		console.log('Creating Potluk from JSON:', json);
		
		const { name } = json
		const date = new Date(json.date)
		const lastModified = new Date(json.lastModified)

		const categories = Object.values(json.categories).map((categoryJson, index) =>
			Category.createFromJson(index, categoryJson)
		)

		return new Potluk(name, date, categories, id, lastModified)
	}

	public copy(): Potluk {
		return new Potluk(
			this.name,
			this.date,
			this.categories,
			this.id,
			this.lastModified
		)
	}
}
