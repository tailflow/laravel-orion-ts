import HasMany from "../../../../../src/drivers/default/relations/hasMany";
import Post from '../../../../stubs/models/post';
import makeServer from "../server";
import User from "../../../../stubs/models/user";

let server: any;

beforeEach(() => {
	server = makeServer();
});

afterEach(() => {
	server.shutdown()
});

describe('HasMany tests', () => {

	type PostAttributes = {
		title: string
	};

	test('associating a resource', async () => {
		const userEntity = server.schema.users.create({name: 'Test User'});
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const user = new User(userEntity.attrs);

		const hasManyRelation = new HasMany<Post, PostAttributes>(Post, user);
		const associatedPost = await hasManyRelation.associate(postEntity.attrs.id);

		expect(associatedPost).toBeInstanceOf(Post);
		expect(associatedPost.$attributes).toStrictEqual({id: '1', title: 'Test Post', user_id: '1'});
		expect(server.schema.posts.find('1').attrs.user_id).toBe('1');
	});

	test('associating a soft deleted resource', async () => {
		const userEntity = server.schema.users.create({name: 'Test User'});
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const user = new User(userEntity.attrs);

		const hasManyRelation = new HasMany<Post, PostAttributes>(Post, user);
		await hasManyRelation.withTrashed().associate(postEntity.attrs.id);

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({with_trashed: 'true'});
	});

	test('dissociating a resource', async () => {
		const userEntity = server.schema.users.create({name: 'Test User'});
		const postEntity = server.schema.posts.create({title: 'Test Post', user_id: userEntity.attrs.id});

		const user = new User(userEntity.attrs);

		const hasManyRelation = new HasMany<Post, PostAttributes>(Post, user);
		const associatedPost = await hasManyRelation.dissociate(postEntity.attrs.id);

		expect(associatedPost).toBeInstanceOf(Post);
		expect(associatedPost.$attributes).toStrictEqual({id: '1', title: 'Test Post', user_id: null});
		expect(server.schema.posts.find('1').attrs.user_id).toBeNull();
	});

	test('dissociating a soft deleted resource', async () => {
		const userEntity = server.schema.users.create({name: 'Test User'});
		const postEntity = server.schema.posts.create({title: 'Test Post', user_id: userEntity.attrs.id});

		const user = new User(userEntity.attrs);

		const hasManyRelation = new HasMany<Post, PostAttributes>(Post, user);
		await hasManyRelation.withTrashed().dissociate(postEntity.attrs.id);

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({with_trashed: 'true'});
	});
});


