import Event from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'

Event.on('db:query', function ({ sql, bindings }) {
  console.log(sql, bindings)
})
Event.on('db:query', Database.prettyPrint)
