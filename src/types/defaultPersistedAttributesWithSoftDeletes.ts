import { DefaultPersistedAttributes } from './defaultPersistedAttributes';

export type DefaultPersistedAttributesWithSoftDeletes<T> = T &
	DefaultPersistedAttributes<T> & {
		deleted_at: string | null;
	};
