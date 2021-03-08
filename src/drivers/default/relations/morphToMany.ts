import {Model} from '../../../model';
import {BelongsToMany} from './belongsToMany';
import {ExtractModelAttributesType} from '../../../types/extractModelAttributesType';
import {ExtractModelPersistedAttributesType} from '../../../types/extractModelPersistedAttributesType';
import {ExtractModelRelationsType} from '../../../types/extractModelRelationsType';

export class MorphToMany<Relation extends Model,
	Pivot = {},
	Attributes = ExtractModelAttributesType<Relation>,
	PersistedAttributes = ExtractModelPersistedAttributesType<Attributes>,
	Relations = ExtractModelRelationsType<Relation>> extends BelongsToMany<Relation, Pivot, Attributes, PersistedAttributes, Relations> {
}
