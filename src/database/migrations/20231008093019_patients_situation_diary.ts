import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('patients_situation_diary', (table) => {
    table.integer('patient_id').unsigned()
    table.text('situation')
    table.text('thoughts')
    table.text('feelings')
    table.text('behavior')
    table.text('physicalSymptoms')
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('patients_situation_diary')
}
