## Night Bite Level Editor

Link to deployed site: https://night-bite-level-editor.herokuapp.com/

Current version: `pre-beta`

Current board size: `20x12`

## Hotkeys

`r`: rotate / `f`: flip / `e`: eraser / `t`: light

## Level JSON Export

### Schema

```
{
  "tiles": {
    "height": 64, // pixel height of a tile
    "width": 64, // pixel width of a tile
    "rows": 12, // tile height of game board
    "columns": 20 // tile width of game board
    "coordinateAdjusted": true // indicate if coordinate flipping was handled
  },
  "assets" : [ // 3d array of row x column x elements array
    [
      [elements]
    ]
  ]
}

// All elements follow the same format:
{
  "name": "type_x_y || teamName",
  "texture": "pathToAsset",
  "flip": false, // horizontal flip
  "rotate": 0, // number of clockwise 90 degree rotations from the original
  "type": "typeOfAsset", // one of TILE_TYPE listed below
  "light": false, // indicate need for light source
  "enemyType": null || "enemy_type" // if type=='enemy', give enemy type
}

TILE_TYPE = 'ground' || 'wall' || 'hole' || 'team' || 'item' || 'character' || 'enemy' || 'decoration'
```

### Example

```json
{
  "tiles": { "height": 64, "width": 64, "rows": 12, "columns": 20 },
  "assets": [
    [
      [
        {
          "name": "ground_0_0",
          "texture": "background/blue/Blue_Texture.png",
          "flip": false,
          "rotate": 0,
          "type": "ground",
          "light": false,
          "enemyType": null
        },
        {
          "name": "teamA",
          "texture": "character/P1_64.png",
          "flip": false,
          "rotate": 0,
          "type": "character",
          "light": true,
          "enemyType": null
        }
      ],
      [
        {
          "name": "ground_1_0",
          "texture": "background/blue/Blue_Texture.png",
          "flip": false,
          "rotate": 0,
          "type": "ground",
          "light": false,
          "enemyType": null
        },
        {
          "name": "enemy_8_8",
          "texture": "character/enemy/E2_64.png",
          "flip": false,
          "rotate": 0,
          "type": "enemy",
          "light": false,
          "enemyType": "OilEnemy"
        }
      ]
    ]
  ]
}
```
