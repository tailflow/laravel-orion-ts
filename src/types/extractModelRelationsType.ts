import Model from '../model';

export type ExtractModelRelationsType<T> = T extends Model<
	infer Attributes,
	infer Relations,
	infer PersistedAttributes
>
	? Relations
	: never;
