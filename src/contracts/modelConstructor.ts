import Model from '../model';

export default interface ModelConstructor<M extends Model<Attributes>, Attributes> {
	new (attributes?: Attributes): M;
}
