import { ModelRelations } from './ModelRelations';

export type AggregateItem<Relations> = {
	relation: ModelRelations<Relations>;
	column: string;
}
