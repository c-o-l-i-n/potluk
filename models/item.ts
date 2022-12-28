import UniqueID from './uniqueId'

export default class Item extends UniqueID {
	public name: string
	public createdByUser: string
	public broughtBy: string | null
	public categoryIndex: number

	constructor(
		name: string,
		createdByUser: string,
		broughtBy: string | null,
		categoryIndex: number,
		id?: string
	) {
		super(id)
		this.name = name
		this.createdByUser = createdByUser
		this.broughtBy = broughtBy
		this.categoryIndex = categoryIndex
	}

	public static createFromJson = (id: string, categoryIndex: number, json: Item): Item => {
		const { name, createdByUser, broughtBy } = json
		return new Item(name, createdByUser, broughtBy, categoryIndex, id)
	}
}
