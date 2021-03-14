import {QueryBuilder} from './drivers/default/builders/queryBuilder';
import pluralize from 'pluralize';
import {noCase, snakeCase} from 'change-case';
import {ModelConstructor} from './contracts/modelConstructor';
import {AxiosResponse} from 'axios';
import {DefaultPersistedAttributes} from "./types/defaultPersistedAttributes";

export abstract class Model<Attributes = {},
	PersistedAttributes = {} | DefaultPersistedAttributes,
	Relations = {},
	Key extends number | string = number | string,
	AllAttributes = Attributes & PersistedAttributes> {
	public $attributes!: AllAttributes;
	public $relations!: Relations;

	public $response?: AxiosResponse;
	protected $keyName: string = 'id';

	constructor(attributes?: AllAttributes, relations?: Relations) {
		this.$init();

		if (attributes) {
			this.$setAttributes(attributes);
		}

		if (relations) {
			this.$setRelations(this.$relations);
		}
	}

	public static $query<M extends Model>(this: ModelConstructor<M>): QueryBuilder<M> {
		return new QueryBuilder<M>(this);
	}

	public $query<M extends Model>(): QueryBuilder<M> {
		return new QueryBuilder<M>(this.constructor as ModelConstructor<M>);
	}

	public async $save<M extends Model>(attributes?: Attributes): Promise<this> {
		if (attributes) {
			this.$setAttributes(attributes as unknown as AllAttributes);
		}

		await this.$query().update(this.$getKey(), attributes || this.$attributes);

		return this;
	}

	public async $destroy<M extends Model>(force: boolean = false): Promise<this> {
		await this.$query().destroy(this.$getKey(), force);

		return this;
	}

	public $getKeyName(): string {
		return this.$keyName;
	}

	public $setKeyName(keyName: string): this {
		this.$keyName = keyName;

		return this;
	}

	public $getKey(): Key {
		return this.$attributes[this.$getKeyName()];
	}

	public $setKey(key: Key): this {
		this.$attributes[this.$getKeyName()] = key;

		return this;
	}

	public $setAttributes(attributes: AllAttributes): this {
		for (const attribute in attributes) {
			this.$attributes[attribute] = attributes[attribute];
		}

		return this;
	}

	public $setRelations(relations: Relations): this {
		for (const relation in relations) {
			this.$relations[relation] = relations[relation];
		}

		return this;
	}

	public $is(model: Model<Attributes, PersistedAttributes, Relations>): boolean {
		return this.$getKey() === model.$getKey();
	}

	public $getResourceName(): string {
		return snakeCase(pluralize(noCase(this.constructor.name)));
	}

	protected $init() {
		if (!this.$attributes) {
			this.$attributes = {} as AllAttributes;
		}

		if (!this.$relations) {
			this.$relations = {} as Relations;
		}
	}
}
