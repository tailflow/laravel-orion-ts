import {DefaultPersistedAttributes} from './defaultPersistedAttributes';

export type DefaultSoftDeletablePersistedAttributes<T> = T &
	DefaultPersistedAttributes<T> & { deleted_at: string | null };
