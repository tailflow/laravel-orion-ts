import { DefaultPersistedAttributes } from './defaultPersistedAttributes';

export type DefaultSoftDeletablePersistedAttributes = DefaultPersistedAttributes & {
	deleted_at: string | null;
};
