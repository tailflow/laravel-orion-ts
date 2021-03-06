import Model from '../../../model';
import QueryBuilder from './queryBuilder';
import ModelConstructor from '../../../contracts/modelConstructor';
import UrlBuilder from '../../../builders/urlBuilder';
import { ExtractModelAttributesType } from '../../../types/extractModelAttributesType';
import { ExtractModelPersistedAttributesType } from '../../../types/extractPersistedModelAttributesType';

export default class RelationQueryBuilder<
	Relation extends Model,
	Attributes = ExtractModelAttributesType<Relation>,
	PersistedAttributes = ExtractModelPersistedAttributesType<Attributes>
> extends QueryBuilder<Relation, Attributes, PersistedAttributes> {
	constructor(
		relationConstructor: ModelConstructor<Relation, Attributes, PersistedAttributes>,
		parent: Model<any>
	) {
		super(relationConstructor);

		this.modelConstructor = relationConstructor;
		this.baseUrl = UrlBuilder.getRelationResourceUrl(parent, relationConstructor);
	}
}
