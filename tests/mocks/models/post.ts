import Model from "../../../src/model";

export default class Post extends Model<{
	title: string,
	deleted_at?: string | null
}> {
}
