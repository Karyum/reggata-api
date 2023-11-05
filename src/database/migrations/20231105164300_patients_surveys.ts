import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('patients_surveys', (table) => {
    table.increments('id').primary()
    table.integer('patient_id').unsigned().notNullable()
    table.foreign('patient_id').references('id').inTable('patients')
    table.string('survey_name').notNullable()
    table.text('answers').notNullable()
    table.string('score').notNullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('patients_surveys')
}
