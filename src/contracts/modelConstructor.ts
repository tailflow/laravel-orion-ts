import {Model} from '../model';
import {ExtractModelAttributesType} from '../types/extractModelAttributesType';
import {ExtractModelPersistedAttributesType} from '../types/extractModelPersistedAttributesType';
import {ExtractModelRelationsType} from '../types/extractModelRelationsType';
import {ExtractModelAllAttributesType} from "../types/extractModelAllAttributesType";

export interface ModelConstructor<M extends Model,
	Attributes = ExtractModelAttributesType<M>,
	PersistedAttributes = ExtractModelPersistedAttributesType<M>,
	Relations = ExtractModelRelationsType<M>,
	AllAttributes = ExtractModelAllAttributesType<M>,
	> {
	new(attributes?: AllAttributes, relations?: Relations): M;
}
