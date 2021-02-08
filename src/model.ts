import QueryBuilder from './builders/queryBuilder';
import Orion from './orion';
import * as pluralize from 'pluralize';
import { noCase, snakeCase } from 'change-case';

export default class Model {
	protected keyName: string = 'id';

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

	public static query<M extends typeof Model>(this: M): QueryBuilder<InstanceType<M>> {
		return new QueryBuilder(this.getBaseUrl());
	}

	public static getResourceName<M extends typeof Model>(this: M): string {
		return snakeCase(pluralize.plural(noCase(this.prototype.constructor.name)));
	}

	public static getBaseUrl<M extends typeof Model>(this: M): string {
		return Orion.getApiUrl() + this.getResourceName();
	}

	public getUrl(): string {
		return (this.constructor as typeof Model).getBaseUrl() + `/${this.getKey()}`;
	}
}
