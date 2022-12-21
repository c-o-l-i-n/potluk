import UniqueID from './uniqueId'

export default class Item extends UniqueID {
	public name: string
	public createdByUser: string
	public broughtByUser: string | null
	public categoryIndex: number

	constructor(
		name: string,
		createdByUser: string,
		broughtByUser: string | null,
		categoryIndex: number,
		id?: string
	) {
		super(id)
		this.name = name
		this.createdByUser = createdByUser
		this.broughtByUser = broughtByUser
		this.categoryIndex = categoryIndex
	}

	public static createFromJson = (json: Item): Item => {
		const { name, createdByUser, broughtByUser, categoryIndex, id } = json
		return new Item(name, createdByUser, broughtByUser, categoryIndex, id)
	}
}
