import { belongsTo, createServer, hasMany, Model as MirageModel } from 'miragejs';
import { Orion } from '../../../../src/orion';
import { LaravelSerializer } from './serializer';

export default function makeServer() {
	return createServer({
		environment: 'test',

		trackRequests: true,

		serializers: {
			application: LaravelSerializer,
		},

		models: {
			post: MirageModel.extend({
				user: belongsTo('user'),
			}),
			user: MirageModel.extend({
				posts: hasMany('posts'),
			}),
		},

		routes: function () {
			this.urlPrefix = 'https://api-mock.test';
			this.namespace = '';

			this.get('/sanctum/csrf-cookie', () => {
				const cookieExpiration = new Date(new Date().getTime() + 24 * 3600 * 1000);
				document.cookie = `XSRF-TOKEN=test; path=/; expires=${cookieExpiration.toUTCString()};`;

				return [];
			});

			this.get('/api/posts');

			this.post('/api/posts', function (schema: any, request) {
				const attrs = JSON.parse(request.requestBody);

				return schema.posts.create(attrs);
			});

			this.post('/api/posts/search', function (schema: any, request) {
				return schema.posts.all();
			});

			this.get('/api/posts/:id');
			this.patch('/api/posts/:id', (schema: any, request) => {
				const id = request.params.id;
				const attrs = JSON.parse(request.requestBody);

				const post = schema.posts.find(id);

				return post.update(attrs);
			});

			this.del('/api/posts/:id', (schema: any, request) => {
				const id = request.params.id;
				const post = schema.posts.find(id);

				if (request.queryParams.force === 'true') {
					post.destroy();
				} else {
					post.update({ deleted_at: '2021-01-01' });
				}

				return post;
			});

			this.post('/api/posts/:id/restore', (schema: any, request) => {
				const id = request.params.id;
				const post = schema.posts.find(id);

				return post.update({ deleted_at: null });
			});

			this.post('/api/users/:id/posts/associate', (schema: any, request) => {
				const userId = request.params.id;
				const postId = JSON.parse(request.requestBody).related_key;
				const post = schema.posts.find(postId);

				return post.update({ user_id: userId });
			});

			this.delete('/api/users/:user_id/posts/:post_id/dissociate', (schema: any, request) => {
				const postId = request.params.post_id;
				const post = schema.posts.find(postId);

				return post.update({ user_id: null });
			});

			this.post('/api/posts/:id/tags/attach', (schema: any, request) => {
				const tagIds = JSON.parse(request.requestBody).resources;

				return {
					attached: Array.isArray(tagIds) ? tagIds : Object.keys(tagIds),
				};
			});

			this.delete('/api/posts/:id/tags/detach', (schema: any, request) => {
				const tagIds = JSON.parse(request.requestBody).resources;

				return {
					detached: Array.isArray(tagIds) ? tagIds : Object.keys(tagIds),
				};
			});

			this.patch('/api/posts/:id/tags/sync', (schema: any, request) => {
				const tagIds = JSON.parse(request.requestBody).resources;

				return {
					attached: Array.isArray(tagIds) ? tagIds : Object.keys(tagIds),
					updated: Array.isArray(tagIds) ? tagIds : Object.keys(tagIds),
					detached: Array.isArray(tagIds) ? tagIds : Object.keys(tagIds),
				};
			});

			this.patch('/api/posts/:id/tags/toggle', (schema: any, request) => {
				const tagIds = JSON.parse(request.requestBody).resources;

				return {
					attached: Array.isArray(tagIds) ? tagIds : Object.keys(tagIds),
					detached: Array.isArray(tagIds) ? tagIds : Object.keys(tagIds),
				};
			});

			this.patch('/api/posts/:post_id/tags/:tag_id/pivot', (schema: any, request) => {
				return {
					updated: [request.params.tag_id],
				};
			});

			this.post('/api/posts/batch', (schema: any, request) => {
				const body: {
					resources: any[]
				} = JSON.parse(request.requestBody);

				const rval: any[] = [];
				for (let i = 0; i < body.resources.length; i++) {
					rval.push(schema.posts.create(body.resources[i]));
				}

				return {data: rval};
			})

			this.patch('/api/posts/batch', (schema: any, request) => {
				const body: {
					resources: Record<string, unknown>
				} = JSON.parse(request.requestBody);

				const rval: any[] = [];
				for (const key in body.resources) {
					const attrs = body.resources[key];

					const post = schema.posts.find(key);


					rval.push(post.update(attrs));
				}

				return {data: rval};
			})

			this.delete('/api/posts/batch', (schema: any, request) => {
				const body: {
					resources: number[]
				} = JSON.parse(request.requestBody);

				const rval: any[] = [];
				for (let i = 0; i < body.resources.length; i++) {
					const id = body.resources[i];
					const post = schema.posts.find(id);

					post.update({ deleted_at: '2021-01-01' });

					rval.push(post);
				}

				return {data: rval};
			})

			this.post('/api/posts/batch/restore', (schema: any, request) => {
				const body: {
					resources: number[]
				} = JSON.parse(request.requestBody);

				const rval: any[] = [];

				for (let i = 0; i < body.resources.length; i++) {
					const id = body.resources[i];
					const post = schema.posts.find(id);

					post.update({ deleted_at: null });

					rval.push(post);
				}

				return {data: rval};
			})
		},
	});
}

Orion.init('https://api-mock.test');
