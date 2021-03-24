import { Model } from '../model';
import { ExtractModelAttributesType } from '../types/extractModelAttributesType';
import { ExtractModelPersistedAttributesType } from '../types/extractModelPersistedAttributesType';
import { ExtractModelRelationsType } from '../types/extractModelRelationsType';
import { ExtractModelKeyType } from '../types/extractModelKeyType';

export interface ModelConstructor<
	M extends Model,
	Attributes = ExtractModelAttributesType<M>,
	PersistedAttributes = ExtractModelPersistedAttributesType<M>,
	Relations = ExtractModelRelationsType<M>,
	Key = ExtractModelKeyType<M>,
	AllAttributes = Attributes & PersistedAttributes
> {
	new (attributes?: AllAttributes, relations?: Relations): M;
}
