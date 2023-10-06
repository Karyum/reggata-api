import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.integer('patient_id').unsigned().nullable()
    table.boolean('access').defaultTo(true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('patient_id')
    table.boolean('access').defaultTo(true)
  })
}
