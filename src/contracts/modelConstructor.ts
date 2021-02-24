import Model from '../model';
import { DefaultPersistedAttributes } from '../types/defaultPersistedAttributes';

export default interface ModelConstructor<
	M extends Model<Attributes, PersistedAttributes>,
	Attributes,
	PersistedAttributes = DefaultPersistedAttributes<Attributes>
> {
	new (attributes?: PersistedAttributes): M;
}
