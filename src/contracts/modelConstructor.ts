import Model from '../model';
import { ExtractModelAttributesType } from '../types/extractModelAttributesType';
import { ExtractModelPersistedAttributesType } from '../types/extractModelPersistedAttributesType';
import { ExtractModelRelationsType } from '../types/extractModelRelationsType';

export default interface ModelConstructor<
	M extends Model,
	Attributes = ExtractModelAttributesType<M>,
	PersistedAttributes = ExtractModelPersistedAttributesType<M>,
	Relations = ExtractModelRelationsType<M>
> {
	new (attributes?: PersistedAttributes, relations?: Relations): M;
}
