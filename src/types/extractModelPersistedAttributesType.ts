import {Model} from '../model';

export type ExtractModelPersistedAttributesType<T> = T extends Model<infer Attributes,
		infer PersistedAttributes,
		infer Relations,
		infer AllAttributes>
	? PersistedAttributes
	: never;
