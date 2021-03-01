import Model from '../../../model';
import { DefaultPersistedAttributes } from '../../../types/defaultPersistedAttributes';
import RelationQueryBuilder from '../builders/relationQueryBuilder';
import { HttpMethod } from '../enums/httpMethod';
import AttachResult from '../results/attachResult';
import { InferModelAttributesType } from '../../../types/inferModelAttributesType';
import DetachResult from '../results/detachResult';

export default class BelongsToMany<
	Relation extends Model<Attributes, PersistedAttributes>,
	Attributes = InferModelAttributesType<Relation>,
	PersistedAttributes = DefaultPersistedAttributes<Attributes>
> extends RelationQueryBuilder<Relation, Attributes, PersistedAttributes> {
	public async attach(
		keys: Array<number | string>,
		duplicates: boolean = false
	): Promise<AttachResult> {
		const response = await this.request(
			`attach`,
			HttpMethod.POST,
			{ duplicates },
			{
				resources: keys
			}
		);

		return new AttachResult(response.data.attached);
	}

	public async attachWithFields(
		resources: Record<string, any>,
		duplicates: boolean = false
	): Promise<AttachResult> {
		const response = await this.request(`attach`, HttpMethod.POST, { duplicates }, { resources });

		return new AttachResult(response.data.attached);
	}

	public async detach(keys: Array<number | string>): Promise<DetachResult> {
		const response = await this.request(`detach`, HttpMethod.DELETE, null, {
			resources: keys
		});

		return new DetachResult(response.data.detached);
	}

	public async detachWithFields(resources: Record<string, any>): Promise<DetachResult> {
		const response = await this.request(`detach`, HttpMethod.DELETE, null, { resources });

		return new DetachResult(response.data.detached);
	}
}
