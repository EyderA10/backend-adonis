import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {

  public async up () {
    this.schema.alterTable('quotations', (table) => {
      table.text('comment').nullable()
    })
  }

  public async down () {
    this.schema.alterTable('quotations', (table) => {
      table.dropColumn('comment')
    })
  }
}
