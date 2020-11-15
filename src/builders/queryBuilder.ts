import axios from 'axios';
import Orion from '../orion';
import { HttpMethod } from '../enums/httpMethod';
import Model from '../model';

export default class QueryBuilder<M extends Model> {
	protected baseUrl: string;
	protected includes: string[] = [];

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	public async paginate(limit: number = 15) {
		return await this.request('', HttpMethod.GET, { limit });
	}

	public async find(key: string | number): Promise<M> {
		const response = await this.request(`${key}`, HttpMethod.GET);

		return response.data as M;
	}

	public async store(attributes: any): Promise<M> {
		const response = await this.request('', HttpMethod.POST, {}, attributes);

		return response.data as M;
	}

	public async update(key: string | number, attributes: any): Promise<M> {
		const response = await this.request(`${key}`, HttpMethod.PATCH, {}, attributes);

		return response.data as M;
	}

	public async destroy(key: string | number): Promise<M> {
		const response = await this.request(`${key}`, HttpMethod.DELETE);

		return response.data as M;
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

	public getBaseUrl(): string {
		return this.baseUrl;
	}

	public getIncludes(): string[] {
		return this.includes;
	}
}
