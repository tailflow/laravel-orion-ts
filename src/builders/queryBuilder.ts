import axios from 'axios';
import { HttpMethod } from '../enums/httpMethod';
import Model from '../model';
import ModelConstructor from '../contracts/modelConstructor';

export default class QueryBuilder<M extends Model> {
	protected baseUrl: string;
	protected includes: string[] = [];
	protected modelConstructor: ModelConstructor<M>;

	constructor(baseUrl: string, modelConstructor: ModelConstructor<M>) {
		this.baseUrl = baseUrl;
		this.modelConstructor = modelConstructor;
	}

	public async paginate(limit: number = 15): Promise<Array<M>> {
		const response = await this.request('', HttpMethod.GET, { limit });

		return response.data.data.map((attributes: Record<string, any>) => {
			return this.hydrate(attributes);
		});
	}

	public async find(key: string | number): Promise<M> {
		const response = await this.request(`${key}`, HttpMethod.GET);

		return this.hydrate(response.data.data);
	}

	public async store(attributes: any): Promise<M> {
		const response = await this.request('', HttpMethod.POST, {}, attributes);

		return this.hydrate(response.data.data);
	}

	public async update(key: string | number, attributes: any): Promise<M> {
		const response = await this.request(`${key}`, HttpMethod.PATCH, {}, attributes);

		return this.hydrate(response.data.data);
	}

	public async destroy(key: string | number): Promise<M> {
		const response = await this.request(`${key}`, HttpMethod.DELETE);

		return this.hydrate(response.data.data);
	}

	public with(relations: string[]): this {
		this.includes = relations;

		return this;
	}

	private async request(url: string, method: HttpMethod, params: any = {}, data: any = {}) {
		let response = await axios.request({
			baseURL: this.getBaseUrl(),
			url,
			method,
			params: Object.assign(params, { include: this.getIncludes() }),
			data
		});

		return response;
	}

	protected hydrate(attributes: Record<string, any>): M {
		return new this.modelConstructor(attributes);
	}

	public getBaseUrl(): string {
		return this.baseUrl;
	}

	public getIncludes(): string[] {
		return this.includes;
	}
}
