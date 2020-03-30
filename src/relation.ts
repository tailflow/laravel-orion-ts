import Model from './model'
import QueryBuilder from './builders/queryBuilder'

export default abstract class Relation<R extends Model> {
	constructor(protected modelReference: Model) {}

	public query(): QueryBuilder<R> {
		return new QueryBuilder(this.baseUrl())
	}

	protected getModelReference(): Model {
		return this.modelReference
	}

	protected baseUrl(): string {
		return this.getModelReference().url()
	}
}
