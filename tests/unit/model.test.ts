import Orion from "../../src/orion";
import Post from "../mocks/models/post";

Orion.setApiUrl('https://example.com/api');

describe('Model tests', () => {

	test('setting and getting key name', () => {
		let model = new Post();
		model.setKeyName('custom_key');

		expect(model.getKeyName()).toBe('custom_key');
	});

	test('setting and getting key', () => {
		let model = new Post();
		model.setKey(123);

		expect(model.getKey()).toBe(123);
	});

	test('getting resource name', () => {
		expect(Post.prototype.getResourceName()).toBe('posts');
	});

});
