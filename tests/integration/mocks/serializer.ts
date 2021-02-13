import {RestSerializer} from "miragejs";

export let LaravelSerializer = RestSerializer.extend({
	keyForCollection(modelName: string) {
		return 'data';
	},
	keyForModel(modelName: string) {
		return 'data';
	},
})
