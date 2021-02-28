import Model from '../../../model';
import { DefaultPersistedAttributes } from '../../../types/defaultPersistedAttributes';
import HasMany from './hasMany';

export default class MorphMany<
	Relation extends Model<Attributes, PersistedAttributes>,
	Attributes,
	PersistedAttributes = DefaultPersistedAttributes<Attributes>
> extends HasMany<Relation, Attributes, PersistedAttributes> {}
