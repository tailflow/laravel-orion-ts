import { DefaultPersistedAttributes } from './defaultPersistedAttributes';

export type DefaultSoftDeletablePersistedAttributes<T> = T &
	DefaultPersistedAttributes & { deleted_at: string | null };
