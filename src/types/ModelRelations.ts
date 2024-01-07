import { ExtractModelRelationsType } from './extractModelRelationsType';

export type DirectModelRelations<Relations> = string & (keyof Relations)
export type ChildModelRelations<Relations> = `${DirectModelRelations<Relations>}.${DirectModelRelations<ExtractModelRelationsType<Relations[keyof Relations]>>}`


export type ModelRelations<Relations> =
	DirectModelRelations<Relations>
	| ChildModelRelations<Relations>
