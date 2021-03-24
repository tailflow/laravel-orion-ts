import makeServer from "./drivers/default/server";
import Post from "../stubs/models/post";

let server: any;

beforeEach(() => {
	server = makeServer();
});

afterEach(() => {
	server.shutdown()
});

describe('Model tests', () => {

	test('saving a model', async () => {
		server.schema.posts.create({title: 'Test Post'});

		const post = await Post.$query().find(1);

		post.$attributes.title = 'Updated Post';
		await post.$save();

		expect(server.schema.posts.find('1').attrs.title).toBe('Updated Post');
	});

	test('trashing a model', async () => {
		server.schema.posts.create({title: 'Test Post'});

		const post = await Post.$query().find(1);

		await post.$destroy();

		expect(server.schema.posts.find('1').attrs.deleted_at).toBeDefined();
	});

	test('force deleting a model', async () => {
		server.schema.posts.create({title: 'Test Post'});

		const post = await Post.$query().find(1);

		await post.$destroy(true);

		expect(server.schema.posts.find('1')).toBeNull();
	});
});


