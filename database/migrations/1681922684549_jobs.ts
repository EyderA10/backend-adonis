import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'jobs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('first_name', 100)
      table.string('last_name', 100)
      table.string('phone_number', 20)
      table.string('email_address', 150).unique()
      table.text('address')
      table.string('postcode', 10)
      table.string('state', 100)
      table.string('type_clothing', 200)
      table.text('description')
      table.integer('budget', 50).nullable()
      table.string('images')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
