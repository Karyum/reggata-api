import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('matches', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('host_id').notNullable()
    table.string('guest_id')
    table.json('board_data').notNullable()
    table.string('host_color').notNullable()
    table.string('guest_color').notNullable()
    table.string('turn')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('matches')
}
