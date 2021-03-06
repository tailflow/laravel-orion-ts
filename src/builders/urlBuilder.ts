import Model from '../model';
import Orion from '../orion';
import ModelConstructor from '../contracts/modelConstructor';
import { ExtractModelAttributesType } from '../types/extractModelAttributesType';
import { ExtractModelPersistedAttributesType } from '../types/extractModelPersistedAttributesType';
import { ExtractModelRelationsType } from '../types/extractModelRelationsType';

export default class UrlBuilder {
	public static getResourceBaseUrl<
		M extends Model,
		Attributes = ExtractModelAttributesType<M>,
		PersistedAttributes = ExtractModelPersistedAttributesType<M>,
		Relations = ExtractModelRelationsType<M>
	>(model: ModelConstructor<M, Attributes, PersistedAttributes, Relations>): string {
		return Orion.getApiUrl() + model.prototype.$getResourceName();
	}

	public static getResourceUrl<Attributes, Relations, PersistedAttributes>(
		model: Model<Attributes, Relations, PersistedAttributes>
	): string {
		return (
			UrlBuilder.getResourceBaseUrl(
				model.constructor as ModelConstructor<Model, Attributes, PersistedAttributes>
			) + `/${model.$getKey()}`
		);
	}

	public static getRelationResourceUrl<
		ParentAttributes,
		ParentPersistedAttributes,
		ParentRelations,
		RelationAttributes,
		RelationPersistedAttributes,
		RelationRelations,
		R extends Model
	>(
		parent: Model<ParentAttributes, ParentRelations, ParentPersistedAttributes>,
		relationConstructor: ModelConstructor<
			R,
			RelationAttributes,
			RelationPersistedAttributes,
			RelationRelations
		>
	): string {
		return (
			UrlBuilder.getResourceUrl(parent) + '/' + relationConstructor.prototype.$getResourceName()
		);
	}
}
