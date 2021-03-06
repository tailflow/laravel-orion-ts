import Model from '../../../model';
import RelationQueryBuilder from '../builders/relationQueryBuilder';
import { ExtractModelAttributesType } from '../../../types/extractModelAttributesType';
import { ExtractModelPersistedAttributesType } from '../../../types/extractPersistedModelAttributesType';

export default class BelongsTo<
	Relation extends Model,
	Attributes = ExtractModelAttributesType<Relation>,
	PersistedAttributes = ExtractModelPersistedAttributesType<Attributes>
> extends RelationQueryBuilder<Relation, Attributes, PersistedAttributes> {}
