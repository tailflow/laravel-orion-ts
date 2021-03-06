import Model from '../../../model';
import RelationQueryBuilder from '../builders/relationQueryBuilder';
import { HttpMethod } from '../enums/httpMethod';
import { ExtractModelAttributesType } from '../../../types/extractModelAttributesType';
import { ExtractModelPersistedAttributesType } from '../../../types/extractPersistedModelAttributesType';

export default class HasMany<
	Relation extends Model,
	Attributes = ExtractModelAttributesType<Relation>,
	PersistedAttributes = ExtractModelPersistedAttributesType<Attributes>
> extends RelationQueryBuilder<Relation, Attributes, PersistedAttributes> {
	public async associate(key: string | number): Promise<Relation> {
		const response = await this.request(`associate`, HttpMethod.POST, this.prepareQueryParams(), {
			related_key: key
		});

		return this.hydrate(response.data.data, response);
	}

	public async dissociate(key: string | number): Promise<Relation> {
		const response = await this.request(
			`${key}/dissociate`,
			HttpMethod.DELETE,
			this.prepareQueryParams()
		);

		return this.hydrate(response.data.data, response);
	}
}
