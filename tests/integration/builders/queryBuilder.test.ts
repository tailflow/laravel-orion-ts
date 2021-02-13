import QueryBuilder from "../../../src/builders/queryBuilder";
import Post from '../mocks/models/post';
import makeServer from "../mocks/server";
import UrlBuilder from "../../../src/builders/urlBuilder";

let server: any;

beforeEach(() => {
	server = makeServer();
});

afterEach(() => {
	server.shutdown()
});

describe('QueryBuilder tests', () => {

	test('retrieving a paginated list of resources', async () => {
		server.schema.posts.create({title: "Test Post A"});
		server.schema.posts.create({title: "Test Post B"});

		const queryBuilder = new QueryBuilder<Post>(UrlBuilder.getResourceBaseUrl(Post), Post);

		const results = await queryBuilder.paginate();

		expect(results[0]).toStrictEqual<Post>(new Post({id: '1', title: 'Test Post A'}));
		expect(results[1]).toStrictEqual<Post>(new Post({id: '2', title: 'Test Post B'}));
		expect(results.length).toBe(2);
	});

	test('retrieving a resource', async () => {
		server.schema.posts.create({title: "Test Post"});

		const queryBuilder = new QueryBuilder<Post>(UrlBuilder.getResourceBaseUrl(Post), Post);

		const post = await queryBuilder.find('1');

		expect(post).toStrictEqual<Post>(new Post({id: '1', title: 'Test Post'}));
	});

});


