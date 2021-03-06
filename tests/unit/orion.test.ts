import Orion from "../../src/orion";

describe('Orion tests', () => {

	test('getting and setting api url', () => {
		Orion.setApiUrl('https://example.com/api/');

		expect(Orion.getApiUrl()).toBe('https://example.com/api/');
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

	test('enabling withCredentials', () => {
		Orion.withCredentials();

		expect(Orion.usesCredentials()).toBeTruthy();
	});

	test('disabling withCredentials', () => {
		Orion.withoutCredentials();

		expect(Orion.usesCredentials()).toBeFalsy();
	});

	test('appending slash to the end when getting api url', () => {
		Orion.setApiUrl('https://example.com/api');

		expect(Orion.getApiUrl()).toBe('https://example.com/api/');
	});

});
