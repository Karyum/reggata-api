import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('patient_notes', (table) => {
    table.increments('id').primary()
    table.integer('patientId').notNullable()
    table.string('note').notNullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('patient_notes')
}
