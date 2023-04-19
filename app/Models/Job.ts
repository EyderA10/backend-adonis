import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, computed, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Drive from '@ioc:Adonis/Core/Drive'
import Quotation from './Quotation'

export default class Job extends BaseModel {
  public static table = 'jobs'

  @column({ isPrimary: true })
  public id: number

  @hasMany(() => Quotation)
  public quotations: HasMany<typeof Quotation>

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public phoneNumber: string

  @column()
  public emailAddress: string

  @column()
  public address: string

  @column()
  public postcode: string

  @column()
  public state: string

  @column()
  public typeClothing: string

  @column()
  public description: string

  @column()
  public budget: number

  @column({ serializeAs: null })
  public images: string[]

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get imageUrls() {
    return this.getImageUrls(this.images)
  }

  async getImageUrls (images: string[]) {
    const imageUrls: string[] = []

    for (const image of images) {
      const signedUrl: string = await Drive.getSignedUrl(`jobs/${image}`)

      imageUrls.push(signedUrl)
    }

    return imageUrls
  }
}
