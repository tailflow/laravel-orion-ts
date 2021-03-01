import Model from '../../../model';
import { DefaultPersistedAttributes } from '../../../types/defaultPersistedAttributes';
import RelationQueryBuilder from '../builders/relationQueryBuilder';
import { HttpMethod } from '../enums/httpMethod';
import { InferModelAttributesType } from '../../../types/inferModelAttributesType';

export default class HasMany<
	Relation extends Model<Attributes, PersistedAttributes>,
	Attributes = InferModelAttributesType<Relation>,
	PersistedAttributes = DefaultPersistedAttributes<Attributes>
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
