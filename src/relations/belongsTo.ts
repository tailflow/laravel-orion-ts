import Relation from '../relation'
import Model from '../model'

export default class BelongsTo<R extends Model> extends Relation<R> {}
