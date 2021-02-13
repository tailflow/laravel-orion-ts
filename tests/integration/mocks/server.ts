import {createServer, Model as MirageModel} from "miragejs";
import Orion from "../../../src/orion";
import {LaravelSerializer} from './serializer';

export default function makeServer() {
	return createServer({
		environment: 'test',

		serializers: {
			application: LaravelSerializer,
		},

		models: {
			post: MirageModel,
		},

		routes() {
			this.urlPrefix = 'https://api-mock.test';
			this.namespace = "api";

			this.get("/posts");
			this.get("/posts/:id");
		},
	});
}

Orion.setApiUrl('https://api-mock.test/api');
