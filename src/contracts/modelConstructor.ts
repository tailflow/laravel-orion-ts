import Model from '../model';
import { ExtractModelAttributesType } from '../types/extractModelAttributesType';
import { ExtractModelPersistedAttributesType } from '../types/extractPersistedModelAttributesType';

export default interface ModelConstructor<
	M extends Model,
	Attributes = ExtractModelAttributesType<M>,
	PersistedAttributes = ExtractModelPersistedAttributesType<M>
> {
	new (attributes?: PersistedAttributes): M;
}
