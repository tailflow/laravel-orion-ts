import Model from '../model';

export default interface ModelConstructor<M extends Model> {
	new (attributes?: Record<string, any>): M;
}
