export const colors = ['#e54b4b', '#1b98e0']

export const initialBoard = [
  [
    {
      tileType: 'shield',
      nextTile: 'up'
    },
    {
      nextTile: 'left'
    },
    {
      nextTile: 'left'
    },
    { nextTile: 'left' },
    null,
    {
      tileType: 'finish'
    },
    { tileType: 'shield', nextTile: 'left' },
    { nextTile: 'left' }
  ],
  [
    {
      nextTile: 'right'
    },
    {
      nextTile: 'right'
    },
    {
      nextTile: 'right'
    },
    { tileType: 'shield', nextTile: 'right' },
    {
      nextTile: 'right'
    },
    {
      nextTile: 'right'
    },
    {
      nextTile: 'right'
    },
    { nextTile: 'up' }
  ],
  [
    {
      tileType: 'shield',
      nextTile: 'down'
    },
    {
      nextTile: 'left'
    },
    {
      nextTile: 'left'
    },
    {
      nextTile: 'left'
    },
    null,
    {
      tileType: 'finish'
    },
    {
      tileType: 'shield',
      nextTile: 'left'
    },
    {
      nextTile: 'left'
    }
  ]
]
