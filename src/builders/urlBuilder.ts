import Model from '../model';
import Orion from '../orion';
import ModelConstructor from '../contracts/modelConstructor';

export default class UrlBuilder {
	public static getResourceBaseUrl<M extends Model<Attributes>, Attributes>(
		model: ModelConstructor<M, Attributes>
	): string {
		return Orion.getApiUrl() + model.prototype.getResourceName();
	}

	public static getResourceUrl<Attributes>(model: Model<Attributes>): string {
		return (
			UrlBuilder.getResourceBaseUrl(
				model.constructor as ModelConstructor<Model<Attributes>, Attributes>
			) + `/${model.getKey()}`
		);
	}
}
