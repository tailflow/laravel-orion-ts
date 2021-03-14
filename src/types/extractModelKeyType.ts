import {Model} from '../model';

export type ExtractModelKeyType<T> = T extends Model<infer Attributes,
		infer PersistedAttributes,
		infer Relations,
		infer Key,
		infer AllAttributes>
	? Key
	: never;
