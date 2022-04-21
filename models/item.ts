export default class Item {
	public name: string
	public createdByUser: string
	public broughtByUser: string | null

	constructor(
		name: string,
		createdByUser: string,
		broughtByUser: string | null
	) {
		this.name = name
		this.createdByUser = createdByUser
		this.broughtByUser = broughtByUser
	}
}
