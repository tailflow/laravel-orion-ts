export type DefaultPersistedAttributes<T> = T & {
	id: number;
	updated_at: string | null;
	created_at: string | null;
};
