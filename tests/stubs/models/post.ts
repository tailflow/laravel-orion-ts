import { Model } from '../../../src/model';
import User from './user';
import { BelongsTo } from '../../../src/drivers/default/relations/belongsTo';
import { DefaultPersistedAttributes } from '../../../src/types/defaultPersistedAttributes';

export default class Post extends Model<
	{
		title: string;
	},
	DefaultPersistedAttributes,
	{
		user: User;
	}
> {
	$resource(): string {
		return 'posts';
	}

	public user(): BelongsTo<User> {
		return new BelongsTo(User, this);
	}
}
