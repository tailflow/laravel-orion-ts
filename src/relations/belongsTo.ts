import Model from '../model';
import { DefaultPersistedAttributes } from '../types/defaultPersistedAttributes';
import RelationQueryBuilder from '../drivers/default/builders/relationQueryBuilder';
import { InferModelAttributesType } from '../types/inferModelAttributesType';

export default class BelongsTo<
	Relation extends Model<Attributes, PersistedAttributes>,
	Attributes = InferModelAttributesType<Relation>,
	PersistedAttributes = DefaultPersistedAttributes<Attributes>
> extends RelationQueryBuilder<Relation, Attributes, PersistedAttributes> {}
