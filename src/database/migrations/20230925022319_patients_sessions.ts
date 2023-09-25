import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('patients_sessions', (table) => {
    table.increments('id').primary()
    table.integer('patient_id').unsigned()
    table.string('time')
    table.text('description')
    table.string('date').notNullable()
    table
      .enum('type', ['session', 'task', 'intake', 'exposure', 'phone-call'])
      .defaultTo('task')
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('patients_sessions')
}
