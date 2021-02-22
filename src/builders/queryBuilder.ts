import axios, { AxiosResponse } from 'axios';
import { HttpMethod } from '../enums/httpMethod';
import Model from '../model';
import ModelConstructor from '../contracts/modelConstructor';
import Scope from '../scope';
import Filter from '../filter';
import { FilterOperator } from '../enums/filterOperator';
import { FilterType } from '../enums/filterType';
import Sorter from '../sorter';
import { SortDirection } from '../enums/sortDirection';
import UrlBuilder from './urlBuilder';

export default class QueryBuilder<M extends Model<Attributes>, Attributes> {
	protected baseUrl: string;
	protected modelConstructor: ModelConstructor<M, Attributes>;

	protected includes: string[] = [];
	protected fetchTrashed: boolean = false;
	protected fetchOnlyTrashed: boolean = false;

	protected scopes: Array<Scope> = [];
	protected filters: Array<Filter> = [];
	protected sorters: Array<Sorter> = [];
	protected searchValue?: string;

	constructor(modelConstructor: ModelConstructor<M, Attributes>, baseUrl?: string) {
		if (baseUrl) {
			this.baseUrl = baseUrl;
		} else {
			this.baseUrl = UrlBuilder.getResourceBaseUrl(modelConstructor);
		}

		this.modelConstructor = modelConstructor;
	}

	public async get(limit: number = 15, page: number = 1): Promise<Array<M>> {
		const response = await this.request('', HttpMethod.GET, { limit, page });

		return response.data.data.map((attributes: Attributes) => {
			return this.hydrate(attributes, response);
		});
	}

	public async search(limit: number = 15, page: number = 1): Promise<Array<M>> {
		const response = await this.request(
			'',
			HttpMethod.POST,
			{ limit, page },
			{
				scopes: this.scopes,
				filters: this.filters,
				search: this.searchValue,
				sort: this.sorters
			}
		);

		return response.data.data.map((attributes: Attributes) => {
			return this.hydrate(attributes, response);
		});
	}

	public async find(key: string | number): Promise<M> {
		const response = await this.request(`${key}`, HttpMethod.GET);

		return this.hydrate(response.data.data, response);
	}

	public async store(attributes: Attributes): Promise<M> {
		const response = await this.request('', HttpMethod.POST, {}, attributes);

		return this.hydrate(response.data.data, response);
	}

	public async update(key: string | number, attributes: Attributes): Promise<M> {
		const response = await this.request(`${key}`, HttpMethod.PATCH, {}, attributes);

		return this.hydrate(response.data.data, response);
	}

	public async destroy(key: string | number, force: boolean = false): Promise<M> {
		const response = await this.request(`${key}`, HttpMethod.DELETE, { force });

		return this.hydrate(response.data.data, response);
	}

	public async restore(key: string | number): Promise<M> {
		const response = await this.request(`${key}/restore`, HttpMethod.POST);

		return this.hydrate(response.data.data, response);
	}

	public with(relations: string[]): this {
		this.includes = relations;

		return this;
	}

	public withTrashed(): this {
		this.fetchTrashed = true;

		return this;
	}

	public onlyTrashed(): this {
		this.fetchOnlyTrashed = true;

		return this;
	}

	public scope(name: string, parameters: Array<any> = []): this {
		this.scopes.push(new Scope(name, parameters));

		return this;
	}

	public filter(field: string, operator: FilterOperator, value: any, type?: FilterType): this {
		this.filters.push(new Filter(field, operator, value, type));

		return this;
	}

	public sort(field: string, direction: SortDirection = SortDirection.Asc): this {
		this.sorters.push(new Sorter(field, direction));

		return this;
	}

	public lookFor(value: string): this {
		this.searchValue = value;

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

	protected hydrate(attributes: Attributes, response: AxiosResponse): M {
		const model = new this.modelConstructor(attributes);

		model.$response = response;

		return model;
	}

	public getBaseUrl(): string {
		return this.baseUrl;
	}

	public getIncludes(): string[] {
		return this.includes;
	}
}
