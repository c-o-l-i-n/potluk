import Item from './item'

export default class Category {
	public name: string
	public items: Item[]

	constructor(name: string, items: Item[]) {
		this.name = name
		this.items = items
	}
}
