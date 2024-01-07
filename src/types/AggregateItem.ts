import { ModelRelations } from './ModelRelations';

export type AggregateItem<Relations> = {
	relation: string & ModelRelations<Relations>;
	column: string;
}
