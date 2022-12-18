import { Orion } from '../../src/orion';
import makeServer from './drivers/default/server';
import { HttpMethod } from '../../src/drivers/default/enums/httpMethod';
import {AuthDriver} from "../../src/drivers/default/enums/authDriver";

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

	test('retrieving csrf cookie', async () => {
		Orion.setAuthDriver(AuthDriver.Sanctum);

		await Orion.makeHttpClient().fetchCsrfToken();

		const requests = server.pretender.handledRequests;
		expect(requests[0].url).toBe('https://api-mock.test/sanctum/csrf-cookie');
	});

	test('attempting to fetch csrf cookie with invalid driver', async () => {
		Orion.setAuthDriver(AuthDriver.Passport);

		try {
			await Orion.makeHttpClient().fetchCsrfToken();
			expect(false).toBeTruthy();
		} catch (error) {
			expect(error.message).toBe(
				`Current auth driver is set to "${AuthDriver.Passport}". Fetching CSRF cookie can only be used with "sanctum" driver.`
			);
		}

		const requests = server.pretender.handledRequests;
		expect(requests).toHaveLength(0);
	});
});
