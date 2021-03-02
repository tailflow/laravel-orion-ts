import Model from '../../../model';
import { DefaultPersistedAttributes } from '../../../types/defaultPersistedAttributes';
import RelationQueryBuilder from '../builders/relationQueryBuilder';
import { HttpMethod } from '../enums/httpMethod';
import AttachResult from '../results/attachResult';
import { InferModelAttributesType } from '../../../types/inferModelAttributesType';
import DetachResult from '../results/detachResult';
import SyncResult from '../results/syncResult';
import ToggleResult from '../results/toggleResult';
import UpdatePivotResult from '../results/updatePivotResult';

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

	public async sync(keys: Array<number | string>, detaching: boolean = true): Promise<SyncResult> {
		const response = await this.request(
			`sync`,
			HttpMethod.PATCH,
			{ detaching },
			{
				resources: keys
			}
		);

		return new SyncResult(response.data.attached, response.data.updated, response.data.detached);
	}

	public async syncWithFields(
		resources: Record<string, any>,
		detaching: boolean = true
	): Promise<SyncResult> {
		const response = await this.request(`sync`, HttpMethod.PATCH, { detaching }, { resources });

		return new SyncResult(response.data.attached, response.data.updated, response.data.detached);
	}

	public async toggle(keys: Array<number | string>): Promise<ToggleResult> {
		const response = await this.request(`toggle`, HttpMethod.PATCH, null, {
			resources: keys
		});

		return new ToggleResult(response.data.attached, response.data.detached);
	}

	public async toggleWithFields(resources: Record<string, any>): Promise<ToggleResult> {
		const response = await this.request(`toggle`, HttpMethod.PATCH, null, { resources });

		return new ToggleResult(response.data.attached, response.data.detached);
	}

	public async updatePivot(key: number | string, pivot: any): Promise<UpdatePivotResult> {
		const response = await this.request(`${key}/pivot`, HttpMethod.PATCH, null, { pivot });

		return new UpdatePivotResult(response.data.updated);
	}
}
