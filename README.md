## Night Bite Level Editor

Link to deployed site: https://night-bite-level-editor.herokuapp.com/

Current version: `pre-beta`

Current board size: `20x10`

## Hotkeys

`r`: rotate / `f`: flip / `e`: eraser

## Level JSON Export

### Schema

```
{
  "tiles": {
    "height": 64, // pixel height of a tile
    "width": 64, // pixel width of a tile
    "rows": 10, // tile height of game board
    "columns": 20 // tile width of game board
  },
  "grounds": { elements },
  "walls": { elements },
  "holes": { elements },
  "teams": { elements },
  "characters": { elements },
  "items": { elements },
  "decorations": { elements }
}

// All elements follow the same format:
    "type_x_y || teamName": {
      "x": 0, // tile Xcoordinate
      "y": 0, // tile Ycoordinate
      "texture": "pathToAsset",
      "flip": false, // horizontal flip
      "rotate": 0 // number of clockwise 90 degree rotations from the original texture
    }
```

### Example

```json
{
  "tiles": { "height": 64, "width": 64, "rows": 10, "columns": 20 },
  "grounds": {
    "ground_18_9": {
      "x": 18,
      "y": 9,
      "texture": "background/ground_64.png",
      "flip": false,
      "rotate": 0
    }
  },
  "walls": {
    "wall_11_9": {
      "x": 11,
      "y": 9,
      "texture": "environment/StallOther1_64.png",
      "flip": false,
      "rotate": 0
    }
  },
  "holes": {
    "hole_13_7": {
      "x": 13,
      "y": 7,
      "texture": "background/hole4_64.png",
      "flip": false,
      "rotate": 0
    }
  },
  "teams": {
    "teamA": {
      "x": 0,
      "y": 0,
      "texture": "environment/StallHome1_64.png",
      "flip": false,
      "rotate": 0
    }
  },
  "characters": {
    "teamA": {
      "x": 1,
      "y": 2,
      "texture": "character/P1_64.png",
      "flip": false,
      "rotate": 0
    }
  },
  "items": {
    "item_18_3": {
      "x": 18,
      "y": 3,
      "texture": "item/food1_64.png",
      "flip": false,
      "rotate": 0
    }
  },
  "decorations": {
    "decoration_16_9": {
      "x": 16,
      "y": 9,
      "texture": "environment/HangingLantern_64.png",
      "flip": false,
      "rotate": 0
    }
  }
}
```
