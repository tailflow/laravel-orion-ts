import { Orion } from '../../src/orion';
import makeServer from './drivers/default/server';
import { HttpMethod } from '../../src/drivers/default/enums/httpMethod';

let server: any;

beforeEach(() => {
	server = makeServer();
});

afterEach(() => {
	server.shutdown();
});

describe('HttpClient tests', () => {
	test('using bearer token', async () => {
		server.schema.posts.create({ title: 'Test Post' });

		Orion.setToken('test');
		await Orion.makeHttpClient().request('/posts', HttpMethod.GET);

		const requests = server.pretender.handledRequests;
		expect(requests[0].requestHeaders['Authorization']).toStrictEqual('Bearer test');
	});
});
