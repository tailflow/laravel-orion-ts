import { Model } from '../../../model';
import { QueryBuilder } from './queryBuilder';
import { ModelConstructor } from '../../../contracts/modelConstructor';
import { UrlBuilder } from '../../../builders/urlBuilder';
import { ExtractModelAttributesType } from '../../../types/extractModelAttributesType';
import { ExtractModelPersistedAttributesType } from '../../../types/extractModelPersistedAttributesType';
import { ExtractModelRelationsType } from '../../../types/extractModelRelationsType';
import { Orion } from '../../../orion';
import { ExtractModelKeyType } from '../../../types/extractModelKeyType';

export class RelationQueryBuilder<
	Relation extends Model,
	Attributes = ExtractModelAttributesType<Relation>,
	PersistedAttributes = ExtractModelPersistedAttributesType<Attributes>,
	Relations = ExtractModelRelationsType<Relation>,
	Key = ExtractModelKeyType<Relation>
> extends QueryBuilder<Relation, Attributes, PersistedAttributes, Relations, Key> {
	constructor(
		relationConstructor: ModelConstructor<
			Relation,
			Attributes,
			PersistedAttributes,
			Relations,
			Key
		>,
		parent: Model<any>
	) {
		super(relationConstructor);

		this.modelConstructor = relationConstructor;
		this.baseUrl = UrlBuilder.getRelationResourceUrl(parent, relationConstructor);
		this.httpClient = Orion.makeHttpClient(this.baseUrl);
	}
}
