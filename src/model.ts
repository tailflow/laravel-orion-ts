import QueryBuilder from './builders/queryBuilder';
import * as pluralize from 'pluralize';
import { noCase, snakeCase } from 'change-case';
import UrlBuilder from './builders/urlBuilder';
import ModelConstructor from './contracts/modelConstructor';

export default class Model {
	public id!: number | string;

	constructor(attributes?: Record<string, any>) {
		if (attributes) {
			this.fill(attributes);
		}
	}

	protected keyName: string = 'id';

	public getKeyName(): string {
		return this.keyName;
	}

	public setKeyName(keyName: string): this {
		this.keyName = keyName;

		return this;
	}

	public getKey(): number | string {
		return this[this.getKeyName()];
	}

	public setKey(key: number | string): this {
		this[this.getKeyName()] = key;

		return this;
	}

	public fill(attributes: Record<string, any>): this {
		for (const attribute in attributes) {
			this[attribute] = attributes[attribute];
		}

		return this;
	}

	public static query<M extends typeof Model>(this: M): QueryBuilder<InstanceType<M>> {
		return new QueryBuilder(
			UrlBuilder.getResourceBaseUrl(this),
			this.constructor as ModelConstructor<InstanceType<M>>
		);
	}

	public static getResourceName<M extends typeof Model>(this: M): string {
		return snakeCase(pluralize.plural(noCase(this.prototype.constructor.name)));
	}
}
