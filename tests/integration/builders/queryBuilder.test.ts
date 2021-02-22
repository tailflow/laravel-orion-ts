import QueryBuilder from "../../../src/builders/queryBuilder";
import Post from '../../mocks/models/post';
import makeServer from "../../mocks/server";

let server: any;

beforeEach(() => {
	server = makeServer();
});

afterEach(() => {
	server.shutdown()
});

describe('QueryBuilder tests', () => {

	type PostAttributes = {
		id?: string
		title: string
	};

	test('retrieving a paginated list of resources', async () => {
		server.schema.posts.create({title: 'Test Post A'});
		server.schema.posts.create({title: 'Test Post B'});

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);

		const results = await queryBuilder.get();

		results.forEach((result) => {
			expect(result).toBeInstanceOf(Post);
		});

		expect(results[0].attributes).toStrictEqual({id: '1', title: 'Test Post A'});
		expect(results[1].attributes).toStrictEqual({id: '2', title: 'Test Post B'});

		expect(results.length).toBe(2);
	});

	test('storing a resource', async () => {
		const queryBuilder = new QueryBuilder<Post,PostAttributes>(Post);

		const post = await queryBuilder.store({
			title: 'Test Post'
		});

		expect(post).toBeInstanceOf(Post);
		expect(post.attributes).toStrictEqual({id: '1', title: 'Test Post'});
		expect(server.schema.posts.find('1').attrs.title).toBe('Test Post');
	});

	test('retrieving a resource', async () => {
		server.schema.posts.create({title: 'Test Post'});

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);

		const post = await queryBuilder.find('1');

		expect(post).toBeInstanceOf(Post);
		expect(post.attributes).toStrictEqual({id: '1', title: 'Test Post'});
	});

	test('updating a resource', async () => {
		server.schema.posts.create({title: 'Test Post'});

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);

		const post = await queryBuilder.update('1', {
			title: 'Updated Post'
		});

		expect(post).toBeInstanceOf(Post);
		expect(post.attributes).toStrictEqual({id: '1', title: 'Updated Post'});
		expect(server.schema.posts.find('1').attrs.title).toBe('Updated Post');
	});

	test('trashing a resource', async () => {
		server.schema.posts.create({title: 'Test Post'});

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);

		const post = await queryBuilder.destroy('1');

		expect(post).toBeInstanceOf(Post);
		expect(post.attributes).toStrictEqual({id: '1', title: 'Test Post', deleted_at: '2021-01-01'});
		expect(server.schema.posts.find('1').attrs.deleted_at).toBeDefined();
	});

	test('restoring a resource', async () => {
		server.schema.posts.create({title: 'Test Post', deleted_at: Date.now()});

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);

		const post = await queryBuilder.restore('1');

		expect(post).toBeInstanceOf(Post);
		expect(post.attributes).toStrictEqual({id: '1', title: 'Test Post', deleted_at: null});
		expect(server.schema.posts.find('1').attrs.deleted_at).toBeNull();
	});

	test('force deleting a resource', async () => {
		server.schema.posts.create({title: 'Test Post'});

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);

		const post = await queryBuilder.destroy('1', true);

		expect(post).toBeInstanceOf(Post);
		expect(post.attributes).toStrictEqual({id: '1', title: 'Test Post'});
		expect(server.schema.posts.find('1')).toBeNull();
	});

});


