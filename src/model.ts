import QueryBuilder from './builders/queryBuilder';
import Orion from './orion';
import pluralize from 'pluralize';

export default class Model {
	protected keyName: string = 'id';

	public static query<T extends typeof Model>(this: T): QueryBuilder<InstanceType<T>> {
		return new QueryBuilder((<any>this).baseUrl());
	}

	public getKeyName(): string {
		return this.keyName;
	}

	public setKeyName(keyName: string): this {
		this.keyName = keyName;

		return this;
	}

	public getKey(): string | number {
		return this[this.getKeyName()];
	}

	public setKey(key: string | number): this {
		this[this.getKeyName()] = key;

		return this;
	}

	protected resource(): string {
		return pluralize.plural(this.constructor.name).toLowerCase();
	}

	protected baseUrl(): string {
		return `${Orion.getApiUrl()}/${this.resource()}/`;
	}

	public url(): string {
		return this.baseUrl() + this.getKey() + '/';
	}
}
