import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Job from './Job'

export default class Quotation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Job)
  public job: BelongsTo<typeof Job>

  @column()
  public status: string

  @column()
  public quotations: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
