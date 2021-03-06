import axios, { AxiosResponse } from 'axios';
import { HttpMethod } from '../enums/httpMethod';
import Model from '../../../model';
import ModelConstructor from '../../../contracts/modelConstructor';
import Scope from '../scope';
import Filter from '../filter';
import { FilterOperator } from '../enums/filterOperator';
import { FilterType } from '../enums/filterType';
import Sorter from '../sorter';
import { SortDirection } from '../enums/sortDirection';
import UrlBuilder from '../../../builders/urlBuilder';
import { ExtractModelAttributesType } from '../../../types/extractModelAttributesType';
import { ExtractModelPersistedAttributesType } from '../../../types/extractModelPersistedAttributesType';
import { ExtractModelRelationsType } from '../../../types/extractModelRelationsType';
import Orion from '../../../orion';

export default class QueryBuilder<
	M extends Model,
	Attributes = ExtractModelAttributesType<M>,
	PersistedAttributes = ExtractModelPersistedAttributesType<M>,
	Relations = ExtractModelRelationsType<M>
> {
	protected baseUrl: string;
	protected modelConstructor: ModelConstructor<M, Attributes, PersistedAttributes, Relations>;

	protected includes: string[] = [];
	protected fetchTrashed: boolean = false;
	protected fetchOnlyTrashed: boolean = false;

	protected scopes: Array<Scope> = [];
	protected filters: Array<Filter> = [];
	protected sorters: Array<Sorter> = [];
	protected searchValue?: string;

	constructor(
		modelConstructor: ModelConstructor<M, Attributes, PersistedAttributes, Relations>,
		baseUrl?: string
	) {
		if (baseUrl) {
			this.baseUrl = baseUrl;
		} else {
			this.baseUrl = UrlBuilder.getResourceBaseUrl(modelConstructor);
		}

		this.modelConstructor = modelConstructor;
	}

	public async get(limit: number = 15, page: number = 1): Promise<Array<M>> {
		const response = await this.request(
			'',
			HttpMethod.GET,
			this.prepareQueryParams({ limit, page })
		);

		return response.data.data.map((attributes: PersistedAttributes & Relations) => {
			return this.hydrate(attributes, response);
		});
	}

	public async search(limit: number = 15, page: number = 1): Promise<Array<M>> {
		const response = await this.request(
			'/search',
			HttpMethod.POST,
			this.prepareQueryParams({ limit, page }),
			{
				scopes: this.scopes,
				filters: this.filters,
				search: { value: this.searchValue },
				sort: this.sorters
			}
		);

		return response.data.data.map((attributes: PersistedAttributes & Relations) => {
			return this.hydrate(attributes, response);
		});
	}

	public async find(key: string | number): Promise<M> {
		const response = await this.request(`${key}`, HttpMethod.GET, this.prepareQueryParams());

		return this.hydrate(response.data.data, response);
	}

	public async store(attributes: Attributes): Promise<M> {
		const response = await this.request('', HttpMethod.POST, this.prepareQueryParams(), attributes);

		return this.hydrate(response.data.data, response);
	}

	public async update(key: string | number, attributes: Attributes): Promise<M> {
		const response = await this.request(
			`${key}`,
			HttpMethod.PATCH,
			this.prepareQueryParams(),
			attributes
		);

		return this.hydrate(response.data.data, response);
	}

	public async destroy(key: string | number, force: boolean = false): Promise<M> {
		const response = await this.request(
			`${key}`,
			HttpMethod.DELETE,
			this.prepareQueryParams({ force })
		);

		return this.hydrate(response.data.data, response);
	}

	public async restore(key: string | number): Promise<M> {
		const response = await this.request(
			`${key}/restore`,
			HttpMethod.POST,
			this.prepareQueryParams()
		);

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

	public sortBy(field: string, direction: SortDirection = SortDirection.Asc): this {
		this.sorters.push(new Sorter(field, direction));

		return this;
	}

	public lookFor(value: string): this {
		this.searchValue = value;

		return this;
	}

	public async request(url: string, method: HttpMethod, params: any = {}, data: any = {}) {
		let headers = {};
		if (Orion.getToken()) {
			headers['Authorization'] = `Bearer ${Orion.getToken()}`;
		}

		return axios.request({ baseURL: this.baseUrl, url, method, params, data, headers });
	}

	public hydrate(raw: PersistedAttributes & Relations, response?: AxiosResponse): M {
		const model = new this.modelConstructor();

		for (const field of Object.keys(raw)) {
			const rawValue = raw[field];

			if (typeof model[field] === 'function') {
				const relationQueryBuilder: QueryBuilder<Model> = model[field]();

				if (Array.isArray(rawValue)) {
					model.$relations[field] = rawValue.map((rawRelation: any) => {
						return relationQueryBuilder.hydrate(rawRelation, response);
					});
				} else {
					model.$relations[field] = relationQueryBuilder.hydrate(rawValue, response);
				}
			} else {
				model.$attributes[field] = rawValue;
			}
		}

		model.$response = response;

		return model;
	}

	protected prepareQueryParams(operationParams: any = {}): any {
		if (this.fetchOnlyTrashed) {
			operationParams.only_trashed = true;
		}

		if (this.fetchTrashed) {
			operationParams.with_trashed = true;
		}

		if (this.includes.length > 0) {
			operationParams.include = this.includes.join(',');
		}

		return operationParams;
	}
}
