import Model from '../../../model';
import RelationQueryBuilder from '../builders/relationQueryBuilder';
import { ExtractModelAttributesType } from '../../../types/extractModelAttributesType';
import { ExtractModelPersistedAttributesType } from '../../../types/extractModelPersistedAttributesType';
import { ExtractModelRelationsType } from '../../../types/extractModelRelationsType';

export default class MorphOne<
	Relation extends Model,
	Attributes = ExtractModelAttributesType<Relation>,
	PersistedAttributes = ExtractModelPersistedAttributesType<Attributes>,
	Relations = ExtractModelRelationsType<Relation>
> extends RelationQueryBuilder<Relation, Attributes, PersistedAttributes, Relations> {}
