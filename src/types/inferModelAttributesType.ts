import Model from '../model';

export type InferModelAttributesType<T> = T extends Model<infer U> ? U : never;
