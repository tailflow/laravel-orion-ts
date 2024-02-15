import { Model } from '../../../src/model';
import Post from './post';
import { HasMany } from '../../../src/drivers/default/relations/hasMany';
import { DefaultPersistedAttributes } from '../../../src/types/defaultPersistedAttributes';

export type UserAttributes = {
	name: string;
}

export type UserRelations = {
	posts: Post[];
}
export default class User extends Model<UserAttributes, DefaultPersistedAttributes, UserRelations> {
	$resource(): string {
		return 'users';
	}

	public posts(): HasMany<Post> {
		return new HasMany(Post, this);
	}
}
