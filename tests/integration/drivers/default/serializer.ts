import {RestSerializer} from "miragejs";
import {snakeCase} from "change-case";

export const LaravelSerializer = RestSerializer.extend({
	keyForCollection() {
		return 'data';
	},
	keyForModel() {
		return 'data';
	},
	keyForAttribute(attr) {
		return snakeCase(attr);
	},
})
