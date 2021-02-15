import {RestSerializer} from "miragejs";

export let LaravelSerializer = RestSerializer.extend({
	keyForCollection() {
		return 'data';
	},
	keyForModel() {
		return 'data';
	},
})
