import Model from '../model';
import Orion from '../orion';
import ModelConstructor from '../contracts/modelConstructor';

export default class UrlBuilder {
	public static getResourceBaseUrl<
		M extends Model<Attributes, PersistedAttributes>,
		Attributes,
		PersistedAttributes
	>(model: ModelConstructor<M, Attributes, PersistedAttributes>): string {
		return Orion.getApiUrl() + model.prototype.getResourceName();
	}

	public static getResourceUrl<Attributes, PersistedAttributes>(
		model: Model<Attributes, PersistedAttributes>
	): string {
		return (
			UrlBuilder.getResourceBaseUrl(
				model.constructor as ModelConstructor<
					Model<Attributes, PersistedAttributes>,
					Attributes,
					PersistedAttributes
				>
			) + `/${model.getKey()}`
		);
	}

	public static getRelationResourceUrl<
		ParentAttributes,
		ParentPersistedAttributes,
		RelationAttributes,
		RelationPersistedAttributes,
		R extends Model<RelationAttributes, RelationPersistedAttributes>
	>(
		parent: Model<ParentAttributes, ParentPersistedAttributes>,
		relationConstructor: ModelConstructor<R, RelationAttributes, RelationPersistedAttributes>
	): string {
		return (
			UrlBuilder.getResourceUrl(parent) + '/' + relationConstructor.prototype.getResourceName()
		);
	}
}
