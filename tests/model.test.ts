import Model from "../src/model";
import Orion from "../src/Orion";

class ExampleModel extends Model {

}

Orion.setApiUrl('https://example.com/api');

describe('Model tests', () => {
	test('setting and getting key name', () => {
		let model = new ExampleModel();
		model.setKeyName('custom_key');

		expect(model.getKeyName()).toBe('custom_key');
	});

	test('setting and getting key', () => {
		let model = new ExampleModel();
		model.setKey(123);

		expect(model.getKey()).toBe(123);
	});

	test('getting resource name', () => {
		expect(ExampleModel.getResourceName()).toBe('example_models');
	});

	test('getting base url', () => {
		expect(ExampleModel.getBaseUrl()).toBe('https://example.com/api/example_models');
	});

	test('getting url', () => {
		let model = new ExampleModel();
		model.setKey(123);

		expect(model.getUrl()).toBe('https://example.com/api/example_models/123');
	});
});
