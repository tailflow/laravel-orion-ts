import { HttpMethod } from "./drivers/default/enums/httpMethod";
import { Model } from "./model";
import { Orion } from "./orion";
import { ExtractModelAttributesType } from "./types/extractModelAttributesType";
import { ExtractModelAllAttributesType } from "./types/extractModelAllAttributesType";
import { ExtractModelRelationsType } from "./types/extractModelRelationsType";
import { ModelConstructor } from "./contracts/modelConstructor";
import { QueryBuilder } from "./drivers/default/builders/queryBuilder";
import { ExtractModelPersistedAttributesType } from "./types/extractModelPersistedAttributesType";
import { ExtractModelKeyType } from "./types/extractModelKeyType";
import { UrlBuilder } from "./builders/urlBuilder";

type HydrateAttributes<M extends Model> = ExtractModelAttributesType<M> & ExtractModelPersistedAttributesType<M> & ExtractModelRelationsType<M>;


export class Batch
{
	private static $httpClient<M extends Model>(
		modelConstructor: ModelConstructor<M>
	) {
		let baseUrl = ''
		if (Orion.getBaseUrl()) {
			baseUrl = Orion.getBaseUrl();
		} else {
			baseUrl = UrlBuilder.getResourceBaseUrl(modelConstructor);
		}
		const httpClient = Orion.makeHttpClient(baseUrl);

		return httpClient;
	}

	public static async store<
		M extends Model,
		Attributes = ExtractModelAttributesType<M>,
		PersistedAttributes = ExtractModelPersistedAttributesType<M>,
		Relations = ExtractModelRelationsType<M>,
		AllAttributes = Attributes & PersistedAttributes
	>(items: M[]): Promise<M[]>
	{
		if (!items.length)
			return [];

		const client = this.$httpClient(items[0].constructor as ModelConstructor<M>);
		const url = items[0].$resource();

		const data = {
			resources: items.map(x => x.$attributes) 
		};

		const response = await client.request<{ data: Array< AllAttributes & Relations > }>(
			`${url}/batch`,
			HttpMethod.POST,
			null,
			data
		);

		return response.data.data.map((attributes: AllAttributes & Relations) => {
			const model: M = new (items[0].constructor as ModelConstructor<M>)();
			return (model.$query() as QueryBuilder<M>)
				.hydrate(attributes as HydrateAttributes<M>, response)
		});
	}

	public static async update<
		M extends Model,
		Attributes = ExtractModelAttributesType<M>,
		PersistedAttributes = ExtractModelPersistedAttributesType<M>,
		Relations = ExtractModelRelationsType<M>,
		AllAttributes = Attributes & PersistedAttributes
	>(items: M[]): Promise<M[]>
	{
		if (!items.length)
			return [];

		const client = this.$httpClient(items[0].constructor as ModelConstructor<M>);
		const url = items[0].$resource();

		const data = {
			resources: {}
		};
		items.forEach((v, i) => data.resources[v.$getKey()] = v.$attributes);

		const response = await client.request<{ data: Array< AllAttributes & Relations > }>(
			`${url}/batch`,
			HttpMethod.PATCH,
			null,
			data
		)

		return response.data.data.map((attributes: AllAttributes & Relations) => {
			const model: M = new (items[0].constructor as ModelConstructor<M>)();
			return (model.$query() as QueryBuilder<M>)
				.hydrate(attributes as HydrateAttributes<M>, response)
		});
	}



	public static async delete<M extends Model>(items: M[]): Promise<M[]>;
	public static async delete<M extends Model>(items: number[], target: M): Promise<M[]>;
	public static async delete<
		M extends Model,
		Attributes = ExtractModelAttributesType<M>,
		PersistedAttributes = ExtractModelPersistedAttributesType<M>,
		Relations = ExtractModelRelationsType<M>,
		AllAttributes = Attributes & PersistedAttributes,
	>(items: number[] | M[], target?: M): Promise<M[]>
	{
		const {ids, url, isModel} = this.getBatchIds(items);
		const finalUrl = url || target?.$resource();
		if (!finalUrl)
			throw "BuilderError: url not found"

		const data = { 
			resources: ids
		};

		const client = this.$httpClient(items[0].constructor as ModelConstructor<M>);
		const response = await client.request<{ data: Array< AllAttributes & Relations > }>(
			`${finalUrl}/batch`,
			HttpMethod.DELETE,
			null,
			data
		);

		const modelConstructor = (isModel ? items[0].constructor : target?.constructor) as ModelConstructor<M> 
		if (!modelConstructor)
			return [];

		return response.data.data.map((attributes: AllAttributes & Relations) => {
			const model: M = new modelConstructor();
			return (model.$query() as QueryBuilder<M>)
				.hydrate(attributes as HydrateAttributes<M>, response)
		});
	}


	public static async restore<M extends Model>(items: M[]): Promise<M[]>;
	public static async restore<M extends Model>(items: number[], target: M): Promise<M[]>;
	public static async restore<
		M extends Model,
		Attributes = ExtractModelAttributesType<M>,
		PersistedAttributes = ExtractModelPersistedAttributesType<M>,
		Relations = ExtractModelRelationsType<M>,
		AllAttributes = Attributes & PersistedAttributes,
	>(items: number[] | M[], target?: M): Promise<M[]>
	{
		const {ids, url, isModel} = this.getBatchIds(items);
		const data = { 
			resources: ids
		};
		const finalUrl = url || target?.$resource();
		const client = this.$httpClient(items[0].constructor as ModelConstructor<M>);


		if (!finalUrl)
			throw "BuilderError: url not found"
		const response = await client.request<{ data: Array< AllAttributes & Relations > }>(
			`${finalUrl}/batch/restore`,
			HttpMethod.POST,
			null,
			data
		)

		const modelConstructor = (isModel ? items[0].constructor : target?.constructor) as ModelConstructor<M> 
		if (!modelConstructor)
			return [];

		return response.data.data.map((attributes: AllAttributes & Relations) => {
			const model: M = new modelConstructor();
			return (model.$query() as QueryBuilder<M>)
				.hydrate(attributes as HydrateAttributes<M>, response)
		});		
	}

	private static getBatchIds<M extends Model>(items: number[] | M[]): {ids: unknown[], url: string | undefined, isModel: boolean} {
		let foundUrl: string | undefined = undefined;
		let isModel = false;

		let ids = items.map((x: number | M) => {
			// also find the url while we're at it
			if (typeof (x) == 'object' && x.$resource() && foundUrl == undefined) {
				foundUrl = x.$resource();
				isModel = true;
			}
		
			return typeof(x) == 'number' ? x : x.$attributes[x.$getKeyName()]
		})

		return {
			ids,
			url: foundUrl,
			isModel
		}
	}
}