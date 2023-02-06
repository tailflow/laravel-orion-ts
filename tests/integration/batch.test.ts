import makeServer from './drivers/default/server';
import Post from '../stubs/models/post';
import { Batch } from '../../src/batch';
import { Orion } from '../../src/orion';

let server: any;

beforeEach(() => {
	server = makeServer();
	Orion.setBaseUrl("https://api-mock.test/api")
});

afterEach(() => {
	server.shutdown();
});

describe('Batch tests', () => {
	test('saving a couple of models', async () => {
		const posts = [
			new Post(),
			new Post(),
		]
		posts[0].$attributes.title = "First";
		posts[1].$attributes.title = "Second";

		const res = await Batch.store(posts);

		expect(server.schema.posts.all()).toHaveLength(2);
		expect(server.schema.posts.find('1').attrs.title).toBe("First")
		expect(server.schema.posts.find('2').attrs.title).toBe("Second")
		expect(server.schema.posts.find('1').attrs.title).toEqual(res[0].$attributes.title)
		expect(server.schema.posts.find('1').attrs.created_at).toEqual(res[0].$attributes.created_at)
		expect(server.schema.posts.find('2').attrs.title).toEqual(res[1].$attributes.title)
		expect(server.schema.posts.find('2').attrs.created_at).toEqual(res[1].$attributes.created_at)
	});

	test('updating a couple of models', async () => {
		const posts = [
			new Post(),
			new Post(),
			new Post(),
		]
		posts[0].$attributes.title = "First";
		posts[1].$attributes.title = "Second";
		posts[2].$attributes.title = "Third";

		let res = await Batch.store(posts);

		res[0].$attributes.title = "NewFirst";
		res[1].$attributes.title = "NewSecond";

		res = await Batch.update([res[0],res[1]]);

		expect(res).toHaveLength(2);
		expect(server.schema.posts.find('1').attrs.title).toBe("NewFirst")
		expect(server.schema.posts.find('2').attrs.title).toBe("NewSecond")
		expect(server.schema.posts.find('1').attrs.title).toEqual(res[0].$attributes.title)
		expect(server.schema.posts.find('2').attrs.title).toEqual(res[1].$attributes.title)
		expect(server.schema.posts.find('3').attrs.title).toEqual("Third");

	});

	test('deleting a couple of models', async () => {
		const posts = [
			new Post(),
			new Post(),
			new Post(),
		]
		posts[0].$attributes.title = "First";
		posts[1].$attributes.title = "Second";
		posts[2].$attributes.title = "Third";

		let res = await Batch.store(posts);

		let ModelDelete = await Batch.delete([res[1]]);
		let idDelete = await Batch.delete([3], new Post);

		expect(server.schema.posts.find('1').attrs.deleted_at).toBeUndefined();
		expect(server.schema.posts.find('2').attrs.deleted_at).toBeDefined();
		expect(server.schema.posts.find('3').attrs.deleted_at).toBeDefined();
		expect(server.schema.posts.find('2').attrs.title).toEqual(ModelDelete[0].$attributes.title)
		expect(server.schema.posts.find('3').attrs.title).toEqual(idDelete[0].$attributes.title)


	});

	test('restoring a couple of models', async () => {
		const posts = [
			new Post(),
			new Post(),
			new Post(),
		]
		posts[0].$attributes.title = "First";
		posts[1].$attributes.title = "Second";
		posts[2].$attributes.title = "Third";

		let res = await Batch.store(posts);

		// delete ID 2 & 3
		let ModelDelete = await Batch.delete([res[1]]);
		let idDelete = await Batch.delete([3], new Post);

		res = await Batch.restore([...ModelDelete, ...idDelete]);

		expect(server.schema.posts.find('1').attrs.deleted_at).toBeFalsy();
		expect(server.schema.posts.find('2').attrs.deleted_at).toBeFalsy();
		expect(server.schema.posts.find('3').attrs.deleted_at).toBeFalsy();
		expect(server.schema.posts.find('2').attrs.title).toEqual(res[0].$attributes.title);
		expect(server.schema.posts.find('3').attrs.title).toEqual(res[1].$attributes.title);


	});
});
