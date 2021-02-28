import Model from '../../../model';
import { DefaultPersistedAttributes } from '../../../types/defaultPersistedAttributes';
import HasMany from './hasMany';

export default class HasManyThrough<
	Relation extends Model<Attributes, PersistedAttributes>,
	Attributes,
	PersistedAttributes = DefaultPersistedAttributes<Attributes>
> extends HasMany<Relation, Attributes, PersistedAttributes> {}
