import Relation from '../relation'
import Model from '../model'

export default class HasOne<R extends Model> extends Relation<R> {}
