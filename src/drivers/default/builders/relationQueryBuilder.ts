import Model from '../../../model';
import QueryBuilder from './queryBuilder';
import { DefaultPersistedAttributes } from '../../../types/defaultPersistedAttributes';
import ModelConstructor from '../../../contracts/modelConstructor';
import UrlBuilder from '../../../builders/urlBuilder';
import { InferModelAttributesType } from '../../../types/inferModelAttributesType';

export default class RelationQueryBuilder<
	Relation extends Model<Attributes, PersistedAttributes>,
	Attributes = InferModelAttributesType<Relation>,
	PersistedAttributes = DefaultPersistedAttributes<Attributes>
> extends QueryBuilder<Relation, Attributes, PersistedAttributes> {
	constructor(
		relationConstructor: ModelConstructor<Relation, Attributes, PersistedAttributes>,
		parent: Model<any>
	) {
		super(relationConstructor);

		this.modelConstructor = relationConstructor;
		this.baseUrl = UrlBuilder.getResourceUrl(parent);
	}
}
