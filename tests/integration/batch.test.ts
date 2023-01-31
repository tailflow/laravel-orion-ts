import makeServer from './drivers/default/server';
import Post from '../stubs/models/post';
import { Batch } from '../../src/batch';

let server: any;

beforeEach(() => {
	server = makeServer();
});

afterEach(() => {
	server.shutdown();
});

describe('Batch tests', () => {
	test('saving a couple of models', async () => {
		await Batch.store(
			[
				new Post({title: "item1", id: 10, created_at: "", updated_at: ""}),
				new Post({title: "item2", id: 12, created_at: "", updated_at: ""}),
			]
		)
	});

	test('updating a couple of models', async () => {
		const post1 = await Post.$query().find(1);
		const post2 = await Post.$query().find(2);

		post1.$attributes.title = "new title";
		post2.$attributes.title = "newer title";

		await Batch.update(
			[
				post1, post2
			]
		)
	});
});
