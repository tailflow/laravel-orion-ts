import { QueryBuilder } from '../../../../../src/drivers/default/builders/queryBuilder';
import Post from '../../../../stubs/models/post';
import makeServer from '../server';
import { FilterOperator } from '../../../../../src/drivers/default/enums/filterOperator';
import { FilterType } from '../../../../../src/drivers/default/enums/filterType';
import { SortDirection } from '../../../../../src/drivers/default/enums/sortDirection';
import User from '../../../../stubs/models/user';

let server: any;

beforeEach(() => {
	server = makeServer();
});

afterEach(() => {
	server.shutdown();
});

describe('QueryBuilder tests', () => {
	type PostAttributes = {
		title: string;
	};

	test('retrieving a paginated list of resources', async () => {
		server.schema.posts.create({ title: 'Test Post A' });
		server.schema.posts.create({ title: 'Test Post B' });

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const results = await queryBuilder.get(2, 5);

		results.forEach((result) => {
			expect(result).toBeInstanceOf(Post);
		});

		expect(results[0].$attributes).toStrictEqual({ id: '1', title: 'Test Post A' });
		expect(results[1].$attributes).toStrictEqual({ id: '2', title: 'Test Post B' });

		expect(results.length).toBe(2);

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({ limit: '2', page: '5' });
	});

	test('retrieving a paginated list of only trashed resources', async () => {
		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		await queryBuilder.onlyTrashed().get();

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({ limit: '15', page: '1', only_trashed: 'true' });
	});

	test('retrieving a paginated list resources with trashed ones', async () => {
		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		await queryBuilder.withTrashed().get();

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({ limit: '15', page: '1', with_trashed: 'true' });
	});

	test('retrieving a paginated list resources with included relations', async () => {
		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		await queryBuilder.with(['user', 'profile']).get();
		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({
			limit: '15',
			page: '1',
			include: 'user,profile'
		});
	});

	test('retrieving a paginated list resources with included aggregates', async () => {
		const queryBuilder = new QueryBuilder<Post>(Post);
		await queryBuilder
			.withAvg({
				column: 'id',
				relation: 'tags'
			})
			.withMin({
				column: 'id',
				relation: 'tags'
			})
			.withMax({
				column: 'id',
				relation: 'tags'
			})
			.withSum({
				column: 'id',
				relation: 'tags'
			})
			.withCount('tags')
			.withExists('tags')
			.get();

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({
			limit: '15',
			page: '1',
			with_avg: 'tags.id',
			with_min: 'tags.id',
			with_max: 'tags.id',
			with_sum: 'tags.id',
			with_count: 'tags',
			with_exists: 'tags'
		});
	});

	test('searching for resources', async () => {
		server.schema.posts.create({ title: 'Test Post A' });
		server.schema.posts.create({ title: 'Test Post B' });

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

		expect(results[0].$attributes).toStrictEqual({ id: '1', title: 'Test Post A' });
		expect(results[1].$attributes).toStrictEqual({ id: '2', title: 'Test Post B' });

		const requests = server.pretender.handledRequests;
		const searchParameters = {
			scopes: [{ name: 'test scope', parameters: [1, 2, 3] }],
			filters: [
				{
					field: 'test field',
					operator: FilterOperator.GreaterThanOrEqual,
					value: 'test value',
					type: FilterType.Or
				}
			],
			search: { value: 'test keyword' },
			sort: [{ field: 'test field', direction: SortDirection.Desc }]
		};
		expect(JSON.parse(requests[0].requestBody)).toStrictEqual(searchParameters);
	});

	test('searching for only trashed resources', async () => {
		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		await queryBuilder.onlyTrashed().search();

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({ limit: '15', page: '1', only_trashed: 'true' });
	});

	test('searching for resources with trashed ones', async () => {
		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		await queryBuilder.withTrashed().search();

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({ limit: '15', page: '1', with_trashed: 'true' });
	});

	test('searching for resources with included relations', async () => {
		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		await queryBuilder.with(['user', 'profile']).search();

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({
			limit: '15',
			page: '1',
			include: 'user,profile'
		});
	});

	test('storing a resource', async () => {
		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const post = await queryBuilder.store({
			title: 'Test Post'
		});

		expect(post).toBeInstanceOf(Post);
		expect(post.$attributes).toStrictEqual({ id: '1', title: 'Test Post' });
		expect(server.schema.posts.find('1').attrs.title).toBe('Test Post');
	});

	test('storing a resource and getting its relations', async () => {
		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const post = await queryBuilder.with(['user', 'profile']).store({
			title: 'Test Post'
		});

		expect(post).toBeInstanceOf(Post);
		expect(post.$attributes).toStrictEqual({ id: '1', title: 'Test Post' });
		expect(server.schema.posts.find('1').attrs.title).toBe('Test Post');

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({ include: 'user,profile' });
	});

	test('retrieving a resource', async () => {
		server.schema.posts.create({ title: 'Test Post' });

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const post = await queryBuilder.find('1');

		expect(post).toBeInstanceOf(Post);
		expect(post.$attributes).toStrictEqual({ id: '1', title: 'Test Post' });
	});

	test('retrieving a soft deleted resource', async () => {
		server.schema.posts.create({ title: 'Test Post' });

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		await queryBuilder.withTrashed().find('1');

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({ with_trashed: 'true' });
	});

	test('retrieving a resource with included relations', async () => {
		server.schema.posts.create({ title: 'Test Post' });

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const post = await queryBuilder.with(['user', 'profile']).find('1');

		expect(post).toBeInstanceOf(Post);
		expect(post.$attributes).toStrictEqual({ id: '1', title: 'Test Post' });

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({ include: 'user,profile' });
	});

	test('updating a resource', async () => {
		server.schema.posts.create({ title: 'Test Post' });

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const post = await queryBuilder.update('1', {
			title: 'Updated Post'
		});

		expect(post).toBeInstanceOf(Post);
		expect(post.$attributes).toStrictEqual({ id: '1', title: 'Updated Post' });
		expect(server.schema.posts.find('1').attrs.title).toBe('Updated Post');
	});

	test('updating a resource with included relations', async () => {
		server.schema.posts.create({ title: 'Test Post' });

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const post = await queryBuilder.with(['user', 'profile']).update('1', {
			title: 'Updated Post'
		});

		expect(post).toBeInstanceOf(Post);
		expect(post.$attributes).toStrictEqual({ id: '1', title: 'Updated Post' });
		expect(server.schema.posts.find('1').attrs.title).toBe('Updated Post');

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({ include: 'user,profile' });
	});

	test('updating a soft deleted resource', async () => {
		server.schema.posts.create({ title: 'Test Post' });

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const post = await queryBuilder.withTrashed().update('1', {
			title: 'Updated Post'
		});

		expect(post).toBeInstanceOf(Post);
		expect(post.$attributes).toStrictEqual({ id: '1', title: 'Updated Post' });
		expect(server.schema.posts.find('1').attrs.title).toBe('Updated Post');

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({ with_trashed: 'true' });
	});

	test('trashing a resource', async () => {
		server.schema.posts.create({ title: 'Test Post' });

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const post = await queryBuilder.destroy('1');

		expect(post).toBeInstanceOf(Post);
		expect(post.$attributes).toStrictEqual({
			id: '1',
			title: 'Test Post',
			deleted_at: '2021-01-01'
		});
		expect(server.schema.posts.find('1').attrs.deleted_at).toBeDefined();
	});

	test('trashing a resource with included relations', async () => {
		server.schema.posts.create({ title: 'Test Post' });

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const post = await queryBuilder.with(['user', 'profile']).destroy('1');

		expect(post).toBeInstanceOf(Post);
		expect(post.$attributes).toStrictEqual({
			id: '1',
			title: 'Test Post',
			deleted_at: '2021-01-01'
		});
		expect(server.schema.posts.find('1').attrs.deleted_at).toBeDefined();

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({ force: 'false', include: 'user,profile' });
	});

	test('restoring a resource', async () => {
		server.schema.posts.create({ title: 'Test Post', deleted_at: Date.now() });

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const post = await queryBuilder.restore('1');

		expect(post).toBeInstanceOf(Post);
		expect(post.$attributes).toStrictEqual({ id: '1', title: 'Test Post', deleted_at: null });
		expect(server.schema.posts.find('1').attrs.deleted_at).toBeNull();
	});

	test('restoring a resource with included relations', async () => {
		server.schema.posts.create({ title: 'Test Post', deleted_at: Date.now() });

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const post = await queryBuilder.with(['user', 'profile']).restore('1');

		expect(post).toBeInstanceOf(Post);
		expect(post.$attributes).toStrictEqual({ id: '1', title: 'Test Post', deleted_at: null });
		expect(server.schema.posts.find('1').attrs.deleted_at).toBeNull();

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({ include: 'user,profile' });
	});

	test('force deleting a resource', async () => {
		server.schema.posts.create({ title: 'Test Post' });

		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const post = await queryBuilder.destroy('1', true);

		expect(post).toBeInstanceOf(Post);
		expect(post.$attributes).toStrictEqual({ id: '1', title: 'Test Post' });
		expect(server.schema.posts.find('1')).toBeNull();

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({ force: 'true' });
	});

	test('hydrating model with attributes and relations', async () => {
		const queryBuilder = new QueryBuilder<Post, PostAttributes>(Post);
		const post = queryBuilder.hydrate({
			id: 1,
			title: 'test',
			updated_at: '2021-02-01',
			created_at: '2021-02-01',
			user: ({
				id: 1,
				name: 'Test User',
				updated_at: '2021-02-01',
				created_at: '2021-02-01'
			} as unknown) as User
		});

		expect(post).toBeInstanceOf(Post);
		expect(post.$attributes).toStrictEqual({
			id: 1,
			title: 'test',
			updated_at: '2021-02-01',
			created_at: '2021-02-01'
		});
		expect(post.$relations.user).toBeInstanceOf(User);
		expect(post.$relations.user.$attributes).toStrictEqual({
			id: 1,
			name: 'Test User',
			updated_at: '2021-02-01',
			created_at: '2021-02-01'
		});
	});
});
