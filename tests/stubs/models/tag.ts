import { Model } from '../../../src/model';
import Post from './post';
import { BelongsToMany } from '../../../src/drivers/default/relations/belongsToMany';

export default class Tag extends Model<{
	content: string;
}> {
	$resource(): string {
		return 'tags';
	}

	public posts(): BelongsToMany<Post> {
		return new BelongsToMany(Post, this);
	}
}
