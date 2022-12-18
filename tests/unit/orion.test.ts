import { Orion } from '../../src/orion';
import { AuthDriver } from '../../src/drivers/default/enums/authDriver';
import axios from 'axios';
import { HttpMethod } from '../../src/drivers/default/enums/httpMethod';

describe('Orion tests', () => {
	test('initialization', () => {
		Orion.init('https://example.com', 'custom-prefix', AuthDriver.Passport, 'test-token');

		expect(Orion.getBaseUrl()).toBe('https://example.com/');
		expect(Orion.getPrefix()).toBe('custom-prefix');
		expect(Orion.getAuthDriver()).toBe(AuthDriver.Passport);
		expect(Orion.getToken()).toBe('test-token');
	});

	test('getting and setting host', () => {
		Orion.setBaseUrl('https://example.com/');

		expect(Orion.getBaseUrl()).toBe('https://example.com/');
	});

	test('getting and setting prefix', () => {
		Orion.setPrefix('api');

		expect(Orion.getPrefix()).toBe('api');
	});

	test('getting api url', () => {
		Orion.setBaseUrl('https://example.com/');
		Orion.setPrefix('api');

		expect(Orion.getApiUrl()).toBe('https://example.com/api');
	});

	test('getting and setting token', () => {
		Orion.setToken('test');

		expect(Orion.getToken()).toBe('test');
	});

	test('unsetting token', () => {
		Orion.setToken('test');
		Orion.withoutToken();

		expect(Orion.getToken()).toBeNull();
	});

	test('appending slash to the end when getting api url', () => {
		Orion.setBaseUrl('https://example.com/api');

		expect(Orion.getBaseUrl()).toBe('https://example.com/api/');
	});

	test('making http client using user-provided callback', () => {
		Orion.init('https://example.com', 'custom-prefix', AuthDriver.Passport, 'test-token');
		Orion.makeHttpClientUsing(() => {
			const client = axios.create();

			client.defaults.baseURL = 'https://custom.com';

			return client;
		});

		expect(Orion.makeHttpClient().getAxios().defaults.baseURL).toBe('https://custom.com');
	});
});
