import QueryBuilder from './builders/queryBuilder';
import * as pluralize from 'pluralize';
import { noCase, snakeCase } from 'change-case';
import ModelConstructor from './contracts/modelConstructor';
import { AxiosResponse } from 'axios';

export default class Model<Attributes> {
	public attributes!: Attributes;
	public $response!: AxiosResponse;

	constructor(attributes?: Attributes) {
		this.initAttributesIfUndefined();
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
		return this.attributes[this.getKeyName()];
	}

	public setKey(key: number | string): this {
		this.attributes[this.getKeyName()] = key;

		return this;
	}

	public fill(attributes: Attributes): this {
		this.initAttributesIfUndefined();

		for (const attribute in attributes) {
			this.attributes[attribute] = attributes[attribute];
		}

		return this;
	}

	public query(): QueryBuilder<this, Attributes> {
		return new QueryBuilder<this, Attributes>(
			this.constructor as ModelConstructor<this, Attributes>
		);
	}

	public is(model: Model<Attributes>): boolean {
		return this.getKey() === model.getKey();
	}

	public getResourceName(): string {
		return snakeCase(pluralize.plural(noCase(this.constructor.name)));
	}

	protected initAttributesIfUndefined() {
		if (!this.attributes) {
			this.attributes = {} as Attributes;
		}
	}
}
