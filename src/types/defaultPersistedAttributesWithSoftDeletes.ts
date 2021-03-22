import {DefaultPersistedAttributes} from './defaultPersistedAttributes';

export type DefaultPersistedAttributesWithSoftDeletes<T> = T &
	DefaultPersistedAttributes & {
	deleted_at: string | null;
};
