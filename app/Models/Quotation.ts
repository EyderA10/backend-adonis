import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Job from './Job'

export default class Quotation extends BaseModel {
  public static table = 'quotations'

  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Job)
  public job: BelongsTo<typeof Job>

  @column()
  public jobId: number

  @column()
  public quotations: number

  @column()
  public comment: string | undefined | null

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
