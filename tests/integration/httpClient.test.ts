import {Orion} from "../../src/orion";
import makeServer from "./drivers/default/server";
import {HttpMethod} from "../../src/drivers/default/enums/httpMethod";
import {AuthDriver} from "../../src/drivers/default/enums/authDriver";

let server: any;

beforeEach(() => {
	server = makeServer();
});

afterEach(() => {
	server.shutdown()
});

describe('HttpClient tests', () => {

	test('using bearer token', async () => {
		server.schema.posts.create({title: 'Test Post'});

		Orion.setToken('test');
		await Orion.makeHttpClient().request('/posts', HttpMethod.GET);

		const requests = server.pretender.handledRequests;
		expect(requests[0].requestHeaders['Authorization']).toStrictEqual('Bearer test');
	});

	test('prefetching xsrf token', async () => {
		server.schema.posts.create({title: 'Test Post'});

		Orion.setAuthDriver(AuthDriver.Sanctum);
		await Orion.makeHttpClient().request('/posts', HttpMethod.GET);

		const requests = server.pretender.handledRequests;
		expect(requests[0].url).toBe('https://api-mock.test/sanctum/csrf-cookie');
		expect(requests[1].url).toBe('https://api-mock.test/api/posts');

		await Orion.makeHttpClient().request('/posts', HttpMethod.GET);
		expect(requests[2].url).toBe('https://api-mock.test/api/posts');
	});
});
