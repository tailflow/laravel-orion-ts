import Model from '../model';
import Orion from '../orion';

export default class UrlBuilder {
	public static getResourceBaseUrl(model: typeof Model): string {
		return Orion.getApiUrl() + model.getResourceName();
	}

	public static getResourceUrl(model: Model): string {
		return UrlBuilder.getResourceBaseUrl(model.constructor.prototype) + `/${model.getKey()}`;
	}
}
