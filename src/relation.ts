import Model from './model';
import QueryBuilder from './builders/queryBuilder';

export default abstract class Relation<R extends Model> {
	constructor(protected parent: Model) {}

	public query(): QueryBuilder<R> {
		return new QueryBuilder(this.baseUrl());
	}

	protected getParent(): Model {
		return this.parent;
	}

	protected baseUrl(): string {
		return this.getParent().getUrl();
	}
}
