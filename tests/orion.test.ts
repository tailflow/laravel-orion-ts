import Orion from "../src/orion";

describe('Orion tests', () => {
	test('getting and setting api url', () => {
		Orion.setApiUrl('https://example.com/api/');

		expect(Orion.getApiUrl()).toBe('https://example.com/api/');
	});

	test('appending slash to the end when getting api url', () => {
		Orion.setApiUrl('https://example.com/api');

		expect(Orion.getApiUrl()).toBe('https://example.com/api/');
	});
});
