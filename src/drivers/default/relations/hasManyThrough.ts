import Model from '../../../model';
import { DefaultPersistedAttributes } from '../../../types/defaultPersistedAttributes';
import HasMany from './hasMany';
import { InferModelAttributesType } from '../../../types/inferModelAttributesType';

export default class HasManyThrough<
	Relation extends Model<Attributes, PersistedAttributes>,
	Attributes = InferModelAttributesType<Relation>,
	PersistedAttributes = DefaultPersistedAttributes<Attributes>
> extends HasMany<Relation, Attributes, PersistedAttributes> {}
