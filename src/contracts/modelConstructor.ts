import Model from '../model';

export default interface ModelConstructor<
	M extends Model<Attributes, PersistedAttributes>,
	Attributes,
	PersistedAttributes
> {
	new (attributes?: PersistedAttributes): M;
}
