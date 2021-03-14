import {Model} from '../model';

export type ExtractModelAllAttributesType<T> = T extends Model<infer Attributes,
		infer PersistedAttributes,
		infer Relations,
		infer AllAttributes>
	? AllAttributes
	: never;
