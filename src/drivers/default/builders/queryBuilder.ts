import {HttpMethod} from '../enums/httpMethod';
import {Model} from '../../../model';
import {ModelConstructor} from '../../../contracts/modelConstructor';
import {Scope} from '../scope';
import {Filter} from '../filter';
import {FilterOperator} from '../enums/filterOperator';
import {FilterType} from '../enums/filterType';
import {Sorter} from '../sorter';
import {SortDirection} from '../enums/sortDirection';
import {UrlBuilder} from '../../../builders/urlBuilder';
import {ExtractModelAttributesType} from '../../../types/extractModelAttributesType';
import {ExtractModelPersistedAttributesType} from '../../../types/extractModelPersistedAttributesType';
import {ExtractModelRelationsType} from '../../../types/extractModelRelationsType';
import {HttpClient} from '../../../httpClient';
import {AxiosResponse} from 'axios';
import {Orion} from '../../../orion';
import {ExtractModelKeyType} from "../../../types/extractModelKeyType";

export class QueryBuilder<M extends Model,
	Attributes = ExtractModelAttributesType<M>,
	PersistedAttributes = ExtractModelPersistedAttributesType<M>,
	Relations = ExtractModelRelationsType<M>,
	Key = ExtractModelKeyType<M>,
	AllAttributes = Attributes & PersistedAttributes,
	> {
	protected baseUrl: string;
	protected modelConstructor: ModelConstructor<M, Attributes, PersistedAttributes, Relations, Key>;
	protected httpClient: HttpClient;

	protected includes: string[] = [];
	protected fetchTrashed: boolean = false;
	protected fetchOnlyTrashed: boolean = false;

	protected scopes: Array<Scope> = [];
	protected filters: Array<Filter> = [];
	protected sorters: Array<Sorter> = [];
	protected searchValue?: string;

	constructor(
		modelConstructor: ModelConstructor<M, Attributes, PersistedAttributes, Relations, Key>,
		baseUrl?: string
	) {
		if (baseUrl) {
			this.baseUrl = baseUrl;
		} else {
			this.baseUrl = UrlBuilder.getResourceBaseUrl(modelConstructor);
		}

		this.modelConstructor = modelConstructor;
		this.httpClient = Orion.makeHttpClient(this.baseUrl);
	}

	public async get(limit: number = 15, page: number = 1): Promise<Array<M>> {
		const response = await this.httpClient.request(
			'/',
			HttpMethod.GET,
			this.prepareQueryParams({limit, page})
		);

		return response.data.data.map((attributes: AllAttributes & Relations) => {
			return this.hydrate(attributes, response);
		});
	}

	public async search(limit: number = 15, page: number = 1): Promise<Array<M>> {
		const response = await this.httpClient.request(
			'/search',
			HttpMethod.POST,
			this.prepareQueryParams({limit, page}),
			{
				scopes: this.scopes,
				filters: this.filters,
				search: {value: this.searchValue},
				sort: this.sorters
			}
		);

		return response.data.data.map((attributes: AllAttributes & Relations) => {
			return this.hydrate(attributes, response);
		});
	}

	public async find(key: Key): Promise<M> {
		const response = await this.httpClient.request(
			`/${key}`,
			HttpMethod.GET,
			this.prepareQueryParams()
		);

		return this.hydrate(response.data.data, response);
	}

	public async store(attributes: Attributes): Promise<M> {
		const response = await this.httpClient.request(
			'/',
			HttpMethod.POST,
			this.prepareQueryParams(),
			attributes
		);

		return this.hydrate(response.data.data, response);
	}

	public async update(key: Key, attributes: Attributes): Promise<M> {
		const response = await this.httpClient.request(
			`/${key}`,
			HttpMethod.PATCH,
			this.prepareQueryParams(),
			attributes
		);

		return this.hydrate(response.data.data, response);
	}

	public async destroy(key: Key, force: boolean = false): Promise<M> {
		const response = await this.httpClient.request(
			`/${key}`,
			HttpMethod.DELETE,
			this.prepareQueryParams({force})
		);

		return this.hydrate(response.data.data, response);
	}

	public async restore(key: Key): Promise<M> {
		const response = await this.httpClient.request(
			`/${key}/restore`,
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

	public hydrate(raw: AllAttributes & Relations, response?: AxiosResponse): M {
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
