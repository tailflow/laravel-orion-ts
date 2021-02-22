import QueryBuilder from "../../../src/builders/queryBuilder";
import Post from '../../mocks/models/post';
import makeServer from "../../mocks/server";
import {FilterOperator} from "../../../src/enums/filterOperator";
import {FilterType} from "../../../src/enums/filterType";
import {SortDirection} from "../../../src/enums/sortDirection";

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

	test('searching for resources', async () => {
		server.schema.posts.create({title: 'Test Post A'});
		server.schema.posts.create({title: 'Test Post B'});

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const results = await queryBuilder
			.scope('test scope', [1, 2, 3])
			.filter('test field', FilterOperator.GreaterThanOrEqual, 'test value', FilterType.Or)
			.lookFor('test keyword')
			.sortBy('test field', SortDirection.Desc)
			.search();

		results.forEach((result) => {
			expect(result).toBeInstanceOf(Post);
		});

		const searchParameters = {
			scopes: [{name: 'test scope', parameters: [1, 2, 3]}],
			filters: [{field: 'test field', operator: FilterOperator.GreaterThanOrEqual, value: 'test value', type: FilterType.Or}],
			search: {value: 'test keyword'},
			sort: [{field: 'test field', direction: SortDirection.Desc}]
		};

		expect(results[0].attributes).toStrictEqual(Object.assign({
			id: '1',
			title: 'Test Post A'
		}, searchParameters));
		expect(results[1].attributes).toStrictEqual(Object.assign({
			id: '2',
			title: 'Test Post B'
		}, searchParameters));
	});

	test('storing a resource', async () => {
		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
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


