export type AggregateItem<Relations> = {
	relation: keyof Relations;
	column: string;
}
