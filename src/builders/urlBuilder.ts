import Model from '../model';
import Orion from '../orion';
import ModelConstructor from '../contracts/modelConstructor';
import { ExtractModelAttributesType } from '../types/extractModelAttributesType';
import { ExtractModelPersistedAttributesType } from '../types/extractPersistedModelAttributesType';

export default class UrlBuilder {
	public static getResourceBaseUrl<
		M extends Model,
		Attributes = ExtractModelAttributesType<M>,
		PersistedAttributes = ExtractModelPersistedAttributesType<M>
	>(model: ModelConstructor<M, Attributes, PersistedAttributes>): string {
		return Orion.getApiUrl() + model.prototype.$getResourceName();
	}

	public static getResourceUrl<Attributes, PersistedAttributes>(
		model: Model<Attributes, PersistedAttributes>
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
		RelationAttributes,
		RelationPersistedAttributes,
		R extends Model
	>(
		parent: Model<ParentAttributes, ParentPersistedAttributes>,
		relationConstructor: ModelConstructor<R, RelationAttributes, RelationPersistedAttributes>
	): string {
		return (
			UrlBuilder.getResourceUrl(parent) + '/' + relationConstructor.prototype.$getResourceName()
		);
	}
}
