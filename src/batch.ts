import { HttpMethod } from "./drivers/default/enums/httpMethod";
import { Model } from "./model";
import { Orion } from "./orion";

export class Batch
{
	private static $httpClient() {
		const httpClient = Orion.makeHttpClient(Orion.getBaseUrl());

		return httpClient;
	}

	public static async store<M extends Model>(items: M[])
	{
		if (!items.length)
			return;

		const client = this.$httpClient();
		const url = items[0].$resource();

		const data = {
			resources: items.map(x => x.$attributes) 
		};

		return client.request(
			`${url}/batch`,
			HttpMethod.POST,
			null,
			data
		)
	}

	public static async update<M extends Model>(items: M[])
	{
		if (!items.length)
			return;

		const client = this.$httpClient();
		const url = items[0].$resource();

		const data = {
			resources: {}
		};
		items.forEach((v, i) => data.resources[v.$getKey()] = v.$attributes);

		return client.request(
			`${url}/batch`,
			HttpMethod.PATCH,
			null,
			data
		)
	}

	public static async delete<M extends Model>(items: number[] | M[], baseUrl?: string)
	{
		const {ids, url} = this.getBatchIds(items);
		const data = { 
			resources: ids
		};
		const finalUrl = url || baseUrl;
		const client = this.$httpClient();


		if (!finalUrl)
			throw "BuilderError: url not found"
		return client.request(
			`${finalUrl}/batch`,
			HttpMethod.DELETE,
			data
		)
	}


	public static async restore<M extends Model>(items: number[] | M[], baseUrl?: string)
	{
		const {ids, url} = this.getBatchIds(items);
		const data = { 
			resources: ids
		};
		const finalUrl = url || baseUrl;
		const client = this.$httpClient();


		if (!finalUrl)
			throw "BuilderError: url not found"
		return client.request(
			`${finalUrl}/batch/restore`,
			HttpMethod.POST,
			data
		)
	}

	private static getBatchIds<M extends Model>(items: number[] | M[]): {ids: unknown[], url: string | undefined} {
		let foundUrl: string | undefined = undefined;

		let ids = items.map((x: number | M) => {
			// also find the url while we're at it
			if (typeof (x) == 'object' && x.$resource() && foundUrl == undefined) {
				foundUrl = x.$resource();
			}
		
			return typeof(x) == 'number' ? x : x.$attributes[x.$getKeyName()]
		})

		return {
			ids,
			url: foundUrl,
		}
	}
}