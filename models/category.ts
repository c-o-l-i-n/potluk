import Item from './item'
import UniqueID from './uniqueId'

export default class Category extends UniqueID {
	public name: string
	public items: Item[]

	constructor(name: string, items: Item[], id?: string) {
		super(id)
		this.name = name
		this.items = items
	}

	public static createFromJson = (json: any): Category => {
		const { name } = json
		const id = json.id

		const items = json.items
			? Object.values(json.items).map((itemJson) =>
					Item.createFromJson(itemJson)
			  )
			: []

		return new Category(name, items, id)
	}
}
