import Model from '../model';
import { DefaultPersistedAttributes } from '../types/defaultPersistedAttributes';
import RelationQueryBuilder from '../drivers/default/builders/relationQueryBuilder';

export default class MorphOne<
	Relation extends Model<Attributes, PersistedAttributes>,
	Attributes,
	PersistedAttributes = DefaultPersistedAttributes<Attributes>
> extends RelationQueryBuilder<Relation, Attributes, PersistedAttributes> {}
