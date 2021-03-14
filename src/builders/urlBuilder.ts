import {Model} from '../model';
import {Orion} from '../orion';
import {ModelConstructor} from '../contracts/modelConstructor';
import {ExtractModelAttributesType} from '../types/extractModelAttributesType';
import {ExtractModelPersistedAttributesType} from '../types/extractModelPersistedAttributesType';
import {ExtractModelRelationsType} from '../types/extractModelRelationsType';
import {ExtractModelAllAttributesType} from "../types/extractModelAllAttributesType";

export class UrlBuilder {
	public static getResourceBaseUrl<M extends Model,
		Attributes = ExtractModelAttributesType<M>,
		PersistedAttributes = ExtractModelPersistedAttributesType<M>,
		Relations = ExtractModelRelationsType<M>,
		AllAttributes = ExtractModelAllAttributesType<M>
		>(model: ModelConstructor<M, Attributes, PersistedAttributes, Relations, AllAttributes>): string {
		return Orion.getApiUrl() + '/' + (model.prototype as M).$getResourceName();
	}

	public static getResourceUrl<M extends Model>(model: Model): string {
		return (
			UrlBuilder.getResourceBaseUrl(model.constructor as ModelConstructor<M>) +
			`/${model.$getKey()}`
		);
	}

	public static getRelationResourceUrl<R extends Model,
		Attributes = ExtractModelAttributesType<R>,
		PersistedAttributes = ExtractModelPersistedAttributesType<R>,
		Relations = ExtractModelRelationsType<R>,
		AllAttributes = ExtractModelAllAttributesType<R>
		>(
		parent: Model,
		relationConstructor: ModelConstructor<R, Attributes, PersistedAttributes, Relations, AllAttributes>
	): string {
		return (
			UrlBuilder.getResourceUrl(parent) +
			'/' +
			(relationConstructor.prototype as R).$getResourceName()
		);
	}
}
