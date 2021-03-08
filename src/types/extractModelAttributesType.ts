import {Model} from '../model';

export type ExtractModelAttributesType<T> = T extends Model<infer Attributes> ? Attributes : never;
