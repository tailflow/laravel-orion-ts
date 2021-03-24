import { Model } from '../../../model';
import { HasMany } from './hasMany';
import { ExtractModelAttributesType } from '../../../types/extractModelAttributesType';
import { ExtractModelPersistedAttributesType } from '../../../types/extractModelPersistedAttributesType';
import { ExtractModelRelationsType } from '../../../types/extractModelRelationsType';

export class HasManyThrough<
	Relation extends Model,
	Attributes = ExtractModelAttributesType<Relation>,
	PersistedAttributes = ExtractModelPersistedAttributesType<Attributes>,
	Relations = ExtractModelRelationsType<Relation>
> extends HasMany<Relation, Attributes, PersistedAttributes, Relations> {}
