import Post from '../../../../stubs/models/post';
import makeServer from "../server";
import BelongsToMany from "../../../../../src/drivers/default/relations/belongsToMany";
import Tag from "../../../../stubs/models/tag";
import AttachResult from "../../../../../src/drivers/default/results/attachResult";
import DetachResult from "../../../../../src/drivers/default/results/detachResult";
import SyncResult from "../../../../../src/drivers/default/results/syncResult";
import ToggleResult from "../../../../../src/drivers/default/results/toggleResult";
import UpdatePivotResult from "../../../../../src/drivers/default/results/updatePivotResult";

let server: any;

beforeEach(() => {
	server = makeServer();
});

afterEach(() => {
	server.shutdown()
});

describe('BelongsToMany tests', () => {

	type TagAttributes = {
		content: string
	};

	type TagPivot = {
		example_pivot_field: string
	};

	test('attaching resources', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagPivot, TagAttributes>(Tag, post);
		const attachResult = await belongsToManyRelation.attach([2, 5, 7]);

		expect(attachResult).toBeInstanceOf(AttachResult);
		expect(attachResult.attached).toStrictEqual([2, 5, 7]);

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({duplicates: 'false'});
	});

	test('attaching resources with duplicates', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagPivot, TagAttributes>(Tag, post);
		await belongsToManyRelation.attach([2, 5, 7], true);

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({duplicates: 'true'});
	});

	test('attaching resources with fields', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagPivot, TagAttributes>(Tag, post);
		const attachResult = await belongsToManyRelation.attachWithFields({
			2: {
				example_pivot_field: 'value A'
			},
			5: {
				example_pivot_field: "value B"
			}
		});

		expect(attachResult).toBeInstanceOf(AttachResult);
		expect(attachResult.attached).toStrictEqual(['2', '5']);

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({duplicates: 'false'});
	});

	test('attaching resources with fields with duplicates', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagPivot, TagAttributes>(Tag, post);
		await belongsToManyRelation.attachWithFields({
			2: {
				example_pivot_field: 'value A'
			},
			5: {
				example_pivot_field: "value B"
			}
		}, true);

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({duplicates: 'true'});
	});

	test('detaching resources', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagPivot, TagAttributes>(Tag, post);
		const detachResult = await belongsToManyRelation.detach([2, 5, 7]);

		expect(detachResult).toBeInstanceOf(DetachResult);
		expect(detachResult.detached).toStrictEqual([2, 5, 7]);
	});

	test('detaching resources with fields', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagPivot, TagAttributes>(Tag, post);
		const detachResult = await belongsToManyRelation.detachWithFields({
			2: {
				example_pivot_field: 'value A'
			},
			5: {
				example_pivot_field: "value B"
			}
		});

		expect(detachResult).toBeInstanceOf(DetachResult);
		expect(detachResult.detached).toStrictEqual(['2', '5']);
	});

	test('syncing resources', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagPivot, TagAttributes>(Tag, post);
		const syncResult = await belongsToManyRelation.sync([2, 5, 7]);

		expect(syncResult).toBeInstanceOf(SyncResult);
		expect(syncResult.attached).toStrictEqual([2, 5, 7]);
		expect(syncResult.updated).toStrictEqual([2, 5, 7]);
		expect(syncResult.detached).toStrictEqual([2, 5, 7]);

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({detaching: 'true'});
	});

	test('syncing resources without detaching', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagPivot, TagAttributes>(Tag, post);
		await belongsToManyRelation.sync([2, 5, 7], false);

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({detaching: 'false'});
	});

	test('syncing resources with fields', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagPivot, TagAttributes>(Tag, post);
		const syncResult = await belongsToManyRelation.syncWithFields({
			2: {
				example_pivot_field: 'value A'
			},
			5: {
				example_pivot_field: "value B"
			}
		});

		expect(syncResult).toBeInstanceOf(SyncResult);
		expect(syncResult.attached).toStrictEqual(['2', '5']);
		expect(syncResult.updated).toStrictEqual(['2', '5']);
		expect(syncResult.detached).toStrictEqual(['2', '5']);

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({detaching: 'true'});
	});

	test('syncing resources with fields without detaching', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagPivot, TagAttributes>(Tag, post);
		await belongsToManyRelation.syncWithFields({
			2: {
				example_pivot_field: 'value A'
			},
			5: {
				example_pivot_field: "value B"
			}
		}, false);

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({detaching: 'false'});
	});

	test('toggling resources', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagPivot, TagAttributes>(Tag, post);
		const toggleResult = await belongsToManyRelation.toggle([2, 5, 7]);

		expect(toggleResult).toBeInstanceOf(ToggleResult);
		expect(toggleResult.attached).toStrictEqual([2, 5, 7]);
		expect(toggleResult.detached).toStrictEqual([2, 5, 7]);
	});

	test('toggling resources with fields', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagPivot, TagAttributes>(Tag, post);
		const toggleResult = await belongsToManyRelation.toggleWithFields({
			2: {
				example_pivot_field: 'value A'
			},
			5: {
				example_pivot_field: "value B"
			}
		});

		expect(toggleResult).toBeInstanceOf(ToggleResult);
		expect(toggleResult.attached).toStrictEqual(['2', '5']);
		expect(toggleResult.detached).toStrictEqual(['2', '5']);
	});

	test('updating resource pivot', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagPivot, TagAttributes>(Tag, post);
		const updatePivotResult = await belongsToManyRelation.updatePivot(5, {example_pivot_field : 'value'});

		expect(updatePivotResult).toBeInstanceOf(UpdatePivotResult);
		expect(updatePivotResult.updated).toStrictEqual(['5']);
	});
});


