import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('patients', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.integer('age')
    table.string('phone')
    table.string('maritalStatus')
    table.json('intakeForm')
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('patients')
}
