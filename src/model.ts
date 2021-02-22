import QueryBuilder from './builders/queryBuilder';
import * as pluralize from 'pluralize';
import { noCase, snakeCase } from 'change-case';
import ModelConstructor from './contracts/modelConstructor';
import { AxiosResponse } from 'axios';
import { DefaultPersistedAttributes } from './types/defaultPersistedAttributes';

export default class Model<
	Attributes,
	PersistedAttributes = DefaultPersistedAttributes<Attributes>
> {
	public attributes!: PersistedAttributes;
	public $response!: AxiosResponse;

	constructor(attributes?: PersistedAttributes) {
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

	public fill(attributes: PersistedAttributes): this {
		this.initAttributesIfUndefined();

		for (const attribute in attributes) {
			this.attributes[attribute] = attributes[attribute];
		}

		return this;
	}

	public query(): QueryBuilder<this, Attributes, PersistedAttributes> {
		return new QueryBuilder<this, Attributes, PersistedAttributes>(
			this.constructor as ModelConstructor<this, Attributes, PersistedAttributes>
		);
	}

	public is(model: Model<Attributes, PersistedAttributes>): boolean {
		return this.getKey() === model.getKey();
	}

	public getResourceName(): string {
		return snakeCase(pluralize.plural(noCase(this.constructor.name)));
	}

	protected initAttributesIfUndefined() {
		if (!this.attributes) {
			this.attributes = {} as PersistedAttributes;
		}
	}
}
