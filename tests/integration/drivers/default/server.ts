import {createServer, Model as MirageModel} from "miragejs";
import Orion from "../../../../src/orion";
import {LaravelSerializer} from './serializer';

export default function makeServer() {
	return createServer({
		environment: 'test',

		trackRequests: true,

		serializers: {
			application: LaravelSerializer,
		},

		models: {
			post: MirageModel,
			user: MirageModel
		},

		routes: function () {
			this.urlPrefix = 'https://api-mock.test';
			this.namespace = "api";

			this.get("/posts");

			this.post("/posts", function (schema: any, request) {
				const attrs = JSON.parse(request.requestBody);

				return schema.posts.create(attrs);
			});

			this.post("/posts/search", function (schema: any, request) {
				return schema.posts.all();
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

			this.post("/users/:id/posts/associate", (schema: any, request) => {
				const userId = request.params.id;
				const postId = JSON.parse(request.requestBody).related_key;
				const post = schema.posts.find(postId);

				return post.update({user_id: userId});
			});

			this.delete("/users/:user_id/posts/:post_id/dissociate", (schema: any, request) => {
				const postId = request.params.post_id;
				const post = schema.posts.find(postId);

				return post.update({user_id: null});
			});

			this.post("/posts/:id/tags/attach", (schema: any, request) => {
				const postId = request.params.id;
				const tagIds = JSON.parse(request.requestBody).resources;

				return {
					attached: Array.isArray(tagIds) ? tagIds : Object.keys(tagIds)
				}
			});

			this.delete("/posts/:id/tags/detach", (schema: any, request) => {
				const postId = request.params.id;
				const tagIds = JSON.parse(request.requestBody).resources;

				return {
					detached: Array.isArray(tagIds) ? tagIds : Object.keys(tagIds)
				}
			});
		},
	});
}

Orion.setApiUrl('https://api-mock.test/api');
