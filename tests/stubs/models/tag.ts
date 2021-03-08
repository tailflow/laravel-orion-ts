import {Model} from "../../../src/model";
import Post from "./post";
import {BelongsToMany} from "../../../src/drivers/default/relations/belongsToMany";

export default class Tag extends Model<{
	content: string,
}> {
	public posts() : BelongsToMany<Post> {
		return new BelongsToMany(Post, this);
	}
}
