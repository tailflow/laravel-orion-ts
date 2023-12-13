import { Orion } from '../../src/orion';
import { AuthDriver } from '../../src/drivers/default/enums/authDriver';
import makeServer from './drivers/default/server';

let server: any;

beforeEach(() => {
	server = makeServer();
});

afterEach(() => {
	server.shutdown();
});

describe('Orion tests', () => {
	test('retrieving csrf cookie', async () => {
		Orion.setAuthDriver(AuthDriver.Sanctum);

		await Orion.csrf();

		const requests = server.pretender.handledRequests;
		expect(requests[0].url).toBe('https://api-mock.test/sanctum/csrf-cookie');
	});

	test('attempting to fetch csrf cookie with invalid driver', async () => {
		Orion.setAuthDriver(AuthDriver.Passport);

		try {
			await Orion.csrf();
			expect(false).toBeTruthy();
		} catch (error) {
			expect((error as Error).message).toBe(
				`Current auth driver is set to "${AuthDriver.Passport}". Fetching CSRF cookie can only be used with "sanctum" driver.`
			);
		}

		const requests = server.pretender.handledRequests;
		expect(requests).toHaveLength(0);
	});
});
