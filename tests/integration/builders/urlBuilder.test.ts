import UrlBuilder from "../../../src/builders/urlBuilder";
import Post from "../../mocks/models/post";
import Orion from "../../../src/orion";

describe('UriBuilder tests', () => {

	test('building resource base url', () => {
		Orion.setApiUrl('https://example.com/api');

		const resourceBaseUrl = UrlBuilder.getResourceBaseUrl(Post);

		expect(resourceBaseUrl).toBe('https://example.com/api/posts');
	});

	test('building resource url', () => {
		Orion.setApiUrl('https://example.com/api');

		const resourceUrl = UrlBuilder.getResourceUrl(new Post({id: '1', title: 'New Post'}));

		expect(resourceUrl).toBe('https://example.com/api/posts/1');
	});
});
