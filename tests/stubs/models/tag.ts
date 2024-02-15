import { Model } from '../../../src/model';
import Post from './post';
import { BelongsToMany } from '../../../src/drivers/default/relations/belongsToMany';
import { DefaultPersistedAttributes } from '../../../src/types/defaultPersistedAttributes';

export default class Tag extends Model<{
	content: string;
}, DefaultPersistedAttributes,
	{
		posts: Post[];
	}> {
	$resource(): string {
		return 'tags';
	}

	public posts(): BelongsToMany<Post> {
		return new BelongsToMany(Post, this);
	}
}
