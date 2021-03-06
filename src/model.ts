import QueryBuilder from './drivers/default/builders/queryBuilder';
import * as pluralize from 'pluralize';
import { noCase, snakeCase } from 'change-case';
import ModelConstructor from './contracts/modelConstructor';
import { AxiosResponse } from 'axios';
import { DefaultPersistedAttributes } from './types/defaultPersistedAttributes';

export default class Model<
	Attributes = {},
	Relations = {},
	PersistedAttributes = DefaultPersistedAttributes<Attributes>
> {
	public $attributes!: PersistedAttributes;
	public $relations!: Relations;
	public $response!: AxiosResponse;

	constructor(attributes?: PersistedAttributes, relations?: Relations) {
		this.$init();

		if (attributes) {
			this.$fill(attributes);
		}

		if (relations) {
			this.$setRelations(this.$relations);
		}
	}

	protected $keyName: string = 'id';

	public $getKeyName(): string {
		return this.$keyName;
	}

	public $setKeyName(keyName: string): this {
		this.$keyName = keyName;

		return this;
	}

	public $getKey(): number | string {
		return this.$attributes[this.$getKeyName()];
	}

	public $setKey(key: number | string): this {
		this.$attributes[this.$getKeyName()] = key;

		return this;
	}

	public $fill(attributes: PersistedAttributes): this {
		this.$init();

		for (const attribute in attributes) {
			this.$attributes[attribute] = attributes[attribute];
		}

		return this;
	}

	public $setRelations(relations: Relations): this {
		this.$init();

		for (const relation in relations) {
			this.$relations[relation] = relations[relation];
		}

		return this;
	}

	public static $query<M extends Model>(this: ModelConstructor<M>): QueryBuilder<M> {
		return new QueryBuilder<M>(this);
	}

	public $is(model: Model<Attributes, Relations, PersistedAttributes>): boolean {
		return this.$getKey() === model.$getKey();
	}

	public $getResourceName(): string {
		return snakeCase(pluralize.plural(noCase(this.constructor.name)));
	}

	protected $init() {
		if (!this.$attributes) {
			this.$attributes = {} as PersistedAttributes;
		}

		if (!this.$relations) {
			this.$relations = {} as Relations;
		}
	}
}
