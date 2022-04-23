import UniqueID from './uniqueId'

export default class Item extends UniqueID {
	public name: string
	public createdByUser: string
	public broughtByUser: string | null
	public categoryId: string

	constructor(
		name: string,
		createdByUser: string,
		broughtByUser: string | null,
		categoryId: string,
		id?: string
	) {
		super(id)
		this.name = name
		this.createdByUser = createdByUser
		this.broughtByUser = broughtByUser
		this.categoryId = categoryId
	}

	public static createFromJson = (json: any): Item => {
		const { name, createdByUser, broughtByUser, categoryId } = json
		const id = json.id

		return new Item(name, createdByUser, broughtByUser, categoryId, id)
	}
}
