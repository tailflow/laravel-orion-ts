import Model from '../../../model';
import { DefaultPersistedAttributes } from '../../../types/defaultPersistedAttributes';
import RelationQueryBuilder from '../builders/relationQueryBuilder';

export default class MorphTo<
	Relation extends Model<Attributes, PersistedAttributes>,
	Attributes,
	PersistedAttributes = DefaultPersistedAttributes<Attributes>
> extends RelationQueryBuilder<Relation, Attributes, PersistedAttributes> {}
