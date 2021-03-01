import Model from '../../../model';
import { DefaultPersistedAttributes } from '../../../types/defaultPersistedAttributes';
import RelationQueryBuilder from '../builders/relationQueryBuilder';
import { InferModelAttributesType } from '../../../types/inferModelAttributesType';

export default class MorphTo<
	Relation extends Model<Attributes, PersistedAttributes>,
	Attributes = InferModelAttributesType<Relation>,
	PersistedAttributes = DefaultPersistedAttributes<Attributes>
> extends RelationQueryBuilder<Relation, Attributes, PersistedAttributes> {}
