import {UrlBuilder} from "../../../src/builders/urlBuilder";
import Post from "../../stubs/models/post";
import {Orion} from "../../../src/orion";
import User from "../../stubs/models/user";

describe('UriBuilder tests', () => {

	test('building resource base url', () => {
		Orion.init('https://example.com');

		const resourceBaseUrl = UrlBuilder.getResourceBaseUrl(Post);

		expect(resourceBaseUrl).toBe('https://example.com/api/posts');
	});

	test('building resource url', () => {
		Orion.init('https://example.com');

		const resourceUrl = UrlBuilder.getResourceUrl(new Post({
			id: 1,
			title: 'New Post',
			created_at: null,
			updated_at: null
		}));

		expect(resourceUrl).toBe('https://example.com/api/posts/1');
	});

	test('building relation resource url', () => {
		Orion.init('https://example.com');

		const resourceUrl = UrlBuilder.getRelationResourceUrl(new User({
			id: 1,
			name: 'New User',
			created_at: null,
			updated_at: null
		}), Post);

		expect(resourceUrl).toBe('https://example.com/api/users/1/posts');
	});
});
