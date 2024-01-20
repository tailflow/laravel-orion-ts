import { Model } from '../../../src/model';
import User from './user';
import { BelongsTo } from '../../../src/drivers/default/relations/belongsTo';
import { DefaultPersistedAttributes } from '../../../src/types/defaultPersistedAttributes';
import Tag from './tag';
import { HasMany } from '../../../src/drivers/default/relations/hasMany';

export default class Post extends Model<
	{
		title: string;
	},
	DefaultPersistedAttributes,
	{
		user: User;
		tags?: Tag[];
	}
> {
	$resource(): string {
		return 'posts';
	}

	public user(): BelongsTo<User> {
		return new BelongsTo(User, this);
	}

	public tags(): HasMany<Tag> {
		return new HasMany(Tag, this);
	}

}
