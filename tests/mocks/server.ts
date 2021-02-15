import {createServer, Model as MirageModel} from "miragejs";
import Orion from "../../src/orion";
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
			this.post("/posts", function (schema: any, request) {
				const attrs = JSON.parse(request.requestBody);

				return schema.posts.create(attrs);
			});
			this.get("/posts/:id");
			this.patch("/posts/:id",  (schema: any, request) => {
				const id = request.params.id
				const attrs = JSON.parse(request.requestBody);

				let post = schema.posts.find(id);

				return post.update(attrs)
			});
			this.del("/posts/:id", (schema: any, request) => {
				const id = request.params.id;
				const post = schema.posts.find(id);

				post.destroy();

				return post;
			});
		},
	});
}

Orion.setApiUrl('https://api-mock.test/api');
