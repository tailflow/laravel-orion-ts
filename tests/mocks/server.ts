import {Collection, createServer, Model as MirageModel} from "miragejs";
import Orion from "../../src/orion";
import {LaravelSerializer} from './serializer';
import {ModelInstance} from "miragejs/-types";

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

			this.post("/posts/search", function (schema: any, request) {
				let posts: Collection<ModelInstance> = schema.posts.all();

				const payload = JSON.parse(request.requestBody);

				posts.models = posts.models.map((post) => {
					post.attrs.scopes = payload.scopes;
					post.attrs.filters = payload.filters;
					post.attrs.search = payload.search;
					post.attrs.sort = payload.sort;

					return post;
				});

				return posts;
			});

			this.get("/posts/:id");
			this.patch("/posts/:id", (schema: any, request) => {
				const id = request.params.id
				const attrs = JSON.parse(request.requestBody);

				let post = schema.posts.find(id);

				return post.update(attrs)
			});

			this.del("/posts/:id", (schema: any, request) => {
				const id = request.params.id;
				const post = schema.posts.find(id);

				if (request.queryParams.force === 'true') {
					post.destroy();
				} else {
					post.update({deleted_at: '2021-01-01'});
				}

				return post;
			});

			this.post("/posts/:id/restore", (schema: any, request) => {
				const id = request.params.id;
				const post = schema.posts.find(id);

				return post.update({deleted_at: null});
			});
		},
	});
}

Orion.setApiUrl('https://api-mock.test/api');
