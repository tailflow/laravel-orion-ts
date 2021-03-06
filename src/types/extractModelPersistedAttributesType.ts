import Model from '../model';

export type ExtractModelPersistedAttributesType<T> = T extends Model<
	infer Attributes,
	infer Relations,
	infer PersistedAttributes
>
	? PersistedAttributes
	: never;
