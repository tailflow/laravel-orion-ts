import Model from "../../../src/model";

export default class Post extends Model<{
	id?: string
	title: string,
	deleted_at?: string | null
}> {
}
