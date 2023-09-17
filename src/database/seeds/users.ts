import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del()

  // Inserts seed entries
  await knex('users').insert([
    {
      id: 1,
      email: 'saboha',
      password: '$2b$10$O1BMU5bz3r1DMAqEQdua2.04IxFvsx/R1KVR0NHVvMaZ.fCuaqtHa',
      name: 'Sobheya'
    }
  ])
}
