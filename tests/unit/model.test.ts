import {Orion} from "../../src/orion";
import Post from "../stubs/models/post";

Orion.setHost('https://example.com/api');

describe('Model tests', () => {

	test('setting and getting key name', () => {
		const model = new Post();
		model.$setKeyName('custom_key');

		expect(model.$getKeyName()).toBe('custom_key');
	});

	test('setting and getting key', () => {
		const model = new Post();
		model.$setKey(123);

		expect(model.$getKey()).toBe(123);
	});

	test('getting resource name', () => {
		expect(Post.prototype.$getResourceName()).toBe('posts');
	});

});
