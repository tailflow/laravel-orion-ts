import {Model} from '../../../model';
import {BelongsToMany} from './belongsToMany';
import {ExtractModelAttributesType} from '../../../types/extractModelAttributesType';
import {ExtractModelPersistedAttributesType} from '../../../types/extractModelPersistedAttributesType';
import {ExtractModelRelationsType} from '../../../types/extractModelRelationsType';
import {ExtractModelAllAttributesType} from "../../../types/extractModelAllAttributesType";

export class MorphToMany<Relation extends Model,
	Pivot = {},
	Attributes = ExtractModelAttributesType<Relation>,
	PersistedAttributes = ExtractModelPersistedAttributesType<Attributes>,
	Relations = ExtractModelRelationsType<Relation>,
	AllAttributes = ExtractModelAllAttributesType<Relation>> extends BelongsToMany<Relation, Pivot, Attributes, PersistedAttributes, Relations, AllAttributes> {
}
