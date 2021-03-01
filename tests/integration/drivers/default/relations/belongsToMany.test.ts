import Post from '../../../../stubs/models/post';
import makeServer from "../server";
import BelongsToMany from "../../../../../src/drivers/default/relations/belongsToMany";
import Tag from "../../../../stubs/models/tag";
import AttachResult from "../../../../../src/drivers/default/results/attachResult";
import DetachResult from "../../../../../src/drivers/default/results/detachResult";

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

	test('attaching resources', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagAttributes>(Tag, post);
		const attachResult = await belongsToManyRelation.attach([2, 5, 7]);

		expect(attachResult).toBeInstanceOf(AttachResult);
		expect(attachResult.attached).toStrictEqual([2, 5, 7]);

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({duplicates: 'false'});
	});

	test('attaching resources with duplicates', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagAttributes>(Tag, post);
		await belongsToManyRelation.attach([2, 5, 7], true);

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({duplicates: 'true'});
	});

	test('attaching resources with fields', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagAttributes>(Tag, post);
		const attachResult = await belongsToManyRelation.attachWithFields({
			2 : {
				example_pivot_field: 'value A'
			},
			5 : {
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

		const belongsToManyRelation = new BelongsToMany<Tag, TagAttributes>(Tag, post);
		await belongsToManyRelation.attachWithFields({
			2 : {
				example_pivot_field: 'value A'
			},
			5 : {
				example_pivot_field: "value B"
			}
		}, true);

		const requests = server.pretender.handledRequests;
		expect(requests[0].queryParams).toStrictEqual({duplicates: 'true'});
	});

	test('detaching resources', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagAttributes>(Tag, post);
		const detachResult = await belongsToManyRelation.detach([2, 5, 7]);

		expect(detachResult).toBeInstanceOf(DetachResult);
		expect(detachResult.detached).toStrictEqual([2, 5, 7]);
	});

	test('detaching resources with fields', async () => {
		const postEntity = server.schema.posts.create({title: 'Test Post'});

		const post = new Post(postEntity.attrs);

		const belongsToManyRelation = new BelongsToMany<Tag, TagAttributes>(Tag, post);
		const detachResult = await belongsToManyRelation.detachWithFields({
			2 : {
				example_pivot_field: 'value A'
			},
			5 : {
				example_pivot_field: "value B"
			}
		});

		expect(detachResult).toBeInstanceOf(DetachResult);
		expect(detachResult.detached).toStrictEqual(['2', '5']);
	});
});


