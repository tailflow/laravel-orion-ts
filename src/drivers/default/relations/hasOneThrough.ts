import {Model} from '../../../model';
import {RelationQueryBuilder} from '../builders/relationQueryBuilder';
import {ExtractModelAttributesType} from '../../../types/extractModelAttributesType';
import {ExtractModelPersistedAttributesType} from '../../../types/extractModelPersistedAttributesType';
import {ExtractModelRelationsType} from '../../../types/extractModelRelationsType';
import {ExtractModelAllAttributesType} from "../../../types/extractModelAllAttributesType";

export class HasOneThrough<Relation extends Model,
	Attributes = ExtractModelAttributesType<Relation>,
	PersistedAttributes = ExtractModelPersistedAttributesType<Attributes>,
	Relations = ExtractModelRelationsType<Relation>,
	AllAttributes = ExtractModelAllAttributesType<Relation>> extends RelationQueryBuilder<Relation, Attributes, PersistedAttributes, Relations, AllAttributes> {
}
