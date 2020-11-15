import Model from '../../model';
import HasMany from '../../relations/hasMany';
import Post from './post';

export default class User extends Model {
	public id?: number;

	public async test() {
		let user = await User.query().find(123);
		let post = await user
			.posts()
			.query()
			.find(234);
		console.log(user.id);
		console.log(post.id);
	}

	public posts(): HasMany<Post> {
		return new HasMany(this);
	}
}
