## Night Bite Level Editor

Current version: `pre-beta`

Current board size: `20x10`

## Hotkeys

`r`: rotate
`f`: flip
`e`: eraser

## Level JSON Export
### Schema
```
{
  "tiles": { "height": 64, "width": 64, "rows": 12, "columns": 25 },
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
      "rotate": 0 // Number of clockwise 90 degree rotations from the original texture
    }
```
### Example
```
{
  "tiles": { "height": 64, "width": 64, "rows": 12, "columns": 25 },
  "grounds": {
    "ground_11_24": {
      "x": 11,
      "y": 24,
      "texture": "background/ground_64.png",
      "flip": false,
      "rotate": 0
    }
  },
  "walls": {
    "wall_11_11": {
      "x": 11,
      "y": 11,
      "texture": "environment/StallOther1_64.png",
      "flip": false,
      "rotate": 0
    }
  },
  "holes": {
    "hole_7_22": {
      "x": 7,
      "y": 22,
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
    "teamA": { "x": 1, 
      "y": 2, 
      "texture": "character/P1_64.png", 
      "flip": false, 
      "rotate": 0 
    }
  },
  "items": {},
  "decorations": {
    "decoration_9_20": {
      "x": 9,
      "y": 20,
      "texture": "environment/HangingLantern_64.png",
      "flip": false,
      "rotate": 0
    }
  }
}
```
