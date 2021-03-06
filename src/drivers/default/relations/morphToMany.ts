import Model from '../../../model';
import { DefaultPersistedAttributes } from '../../../types/defaultPersistedAttributes';
import BelongsToMany from './belongsToMany';
import { ExtractModelAttributesType } from '../../../types/extractModelAttributesType';
import { ExtractModelPersistedAttributesType } from '../../../types/extractPersistedModelAttributesType';

export default class MorphToMany<
	Relation extends Model,
	Pivot = {},
	Attributes = ExtractModelAttributesType<Relation>,
	PersistedAttributes = ExtractModelPersistedAttributesType<Attributes>
> extends BelongsToMany<Relation, Pivot, Attributes, PersistedAttributes> {}
