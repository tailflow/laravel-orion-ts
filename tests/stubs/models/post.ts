import Model from "../../../src/model";
import User from "./user";
import BelongsTo from "../../../src/drivers/default/relations/belongsTo";

export default class Post extends Model<{
	title: string,
	deleted_at?: string | null
}> {
	public user(): BelongsTo<User> {
		return new BelongsTo(User, this);
	}
}
