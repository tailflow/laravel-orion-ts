import Model from '../../../model';
import { DefaultPersistedAttributes } from '../../../types/defaultPersistedAttributes';
import BelongsToMany from './belongsToMany';
import { InferModelAttributesType } from '../../../types/inferModelAttributesType';

export default class MorphToMany<
	Relation extends Model<Attributes, PersistedAttributes>,
	Attributes = InferModelAttributesType<Relation>,
	PersistedAttributes = DefaultPersistedAttributes<Attributes>
> extends BelongsToMany<Relation, Attributes, PersistedAttributes> {}
