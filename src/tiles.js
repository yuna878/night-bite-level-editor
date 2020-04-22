const TILE_TYPE = {
  GROUND: 'ground',
  WALL: 'wall',
  HOLE: 'hole',
  TEAM: 'team',
  ITEM: 'item',
  CHARACTER: 'character',
  DECORATION: 'decoration',
};

const GROUND_TILES = {
  'background/blue/Blue_Texture.png': {
    type: TILE_TYPE.GROUND,
    width: 1,
    height: 1,
    palette: 'Blue',
  },
  'background/purple/Purple_Texture.png': {
    type: TILE_TYPE.GROUND,
    width: 1,
    height: 1,
    palette: 'Purple',
  },
  'background/red/Red_Texture.png': {
    type: TILE_TYPE.GROUND,
    width: 1,
    height: 1,
    palette: 'Red',
  },
};

const BRICK_TILES = {
  'background/blue/Blue_Brick_1.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Blue',
  },
  'background/blue/Blue_Brick_2Adj.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Blue',
  },
  'background/blue/Blue_Brick_2Opp.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Blue',
  },
  'background/blue/Blue_Brick_3.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Blue',
  },
  'background/blue/Blue_Brick_Corner.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Blue',
  },
  'background/purple/Purple_Brick_1.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Purple',
  },
  'background/purple/Purple_Brick_2Adj.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Purple',
  },
  'background/purple/Purple_Brick_2Opp.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Purple',
  },
  'background/purple/Purple_Brick_3.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Purple',
  },
  'background/purple/Purple_Brick_Corner.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Purple',
  },
  'background/red/Red_Brick_1.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Red',
  },
  'background/red/Red_Brick_2Adj.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Red',
  },
  'background/red/Red_Brick_2Opp.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Red',
  },
  'background/red/Red_Brick_3.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Red',
  },
  'background/red/Red_Brick_Corner.png': {
    type: TILE_TYPE.DECORATION,
    width: 1,
    height: 1,
    palette: 'Red',
  },
};

const HOLE_BACKGROUND_TILES = {
  'background/blue/Blue_Gradient.png': {
    type: TILE_TYPE.GROUND,
    width: 1,
    height: 1,
    label: 'grad',
    palette: 'Blue',
  },
  'background/blue/Blue_Hole.png': {
    type: TILE_TYPE.GROUND,
    width: 1,
    height: 1,
    label: 'solid',
    palette: 'Blue',
  },
  'background/purple/Purple_Gradient.png': {
    type: TILE_TYPE.GROUND,
    width: 1,
    height: 1,
    label: 'grad',
    palette: 'Purple',
  },
  'background/purple/Purple_Hole.png': {
    type: TILE_TYPE.GROUND,
    width: 1,
    height: 1,
    label: 'solid',
    palette: 'Purple',
  },
  'background/red/Red_Gradient.png': {
    type: TILE_TYPE.GROUND,
    width: 1,
    height: 1,
    label: 'grad',
    palette: 'Red',
  },
  'background/red/Red_Hole.png': {
    type: TILE_TYPE.GROUND,
    width: 1,
    height: 1,
    label: 'solid',
    palette: 'Red',
  },
};

const HOLE_EDGE_TILES = {
  'background/blue/Blue_HoleEdge_1.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '1',
    palette: 'Blue',
  },
  'background/blue/Blue_HoleEdge_2Adj.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '2-adj',
    palette: 'Blue',
  },
  'background/blue/Blue_HoleEdge_2Opp.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '2-opp',
    palette: 'Blue',
  },
  'background/blue/Blue_HoleEdge_3.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '3',
    palette: 'Blue',
  },
  'background/blue/Blue_HoleEdge_4.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '4',
    palette: 'Blue',
  },
  'background/purple/Purple_HoleEdge_1.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '1',
    palette: 'Purple',
  },
  'background/purple/Purple_HoleEdge_2Adj.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '2-adj',
    palette: 'Purple',
  },
  'background/purple/Purple_HoleEdge_2Opp.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '2-opp',
    palette: 'Purple',
  },
  'background/purple/Purple_HoleEdge_3.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '3',
    palette: 'Purple',
  },
  'background/purple/Purple_HoleEdge_4.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '4',
    palette: 'Purple',
  },
  'background/red/Red_HoleEdge_1.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '1',
    palette: 'Red',
  },
  'background/red/Red_HoleEdge_2Adj.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '2-adj',
    palette: 'Red',
  },
  'background/red/Red_HoleEdge_2Opp.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '2-opp',
    palette: 'Red',
  },
  'background/red/Red_HoleEdge_3.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '3',
    palette: 'Red',
  },
  'background/red/Red_HoleEdge_4.png': {
    type: TILE_TYPE.HOLE,
    width: 1,
    height: 1,
    label: '4',
    palette: 'Red',
  },
};

const CHARACTER_TILES = {
  'character/P1_64.png': {
    type: TILE_TYPE.CHARACTER,
    width: 1,
    height: 1,
    team: 'teamA',
  },
  'character/P2_64_v2.png': {
    type: TILE_TYPE.CHARACTER,
    width: 1,
    height: 1,
    team: 'teamB',
  },
  'character/P3_64_v2.png': {
    type: TILE_TYPE.CHARACTER,
    width: 1,
    height: 1,
    team: 'teamC',
  },
  'character/P4_64.png': {
    type: TILE_TYPE.CHARACTER,
    width: 1,
    height: 1,
    team: 'teamD',
  },
};

const HOME_TILES = {
  'environment/StallHome1_64.png': {
    type: TILE_TYPE.TEAM,
    width: 2,
    height: 2,
    team: 'teamA',
  },
  'environment/StallHome2_64.png': {
    type: TILE_TYPE.TEAM,
    width: 2,
    height: 2,
    team: 'teamB',
  },
  'environment/StallHome3_64.png': {
    type: TILE_TYPE.TEAM,
    width: 2,
    height: 2,
    team: 'teamC',
  },
  'environment/StallHome4_64.png': {
    type: TILE_TYPE.TEAM,
    width: 2,
    height: 2,
    team: 'teamD',
  },
};

const ENVIRONMENT_TILES = {
  'environment/Box_64.png': { type: TILE_TYPE.WALL, width: 1, height: 1 },
  'environment/box_palette2_64.png': { type: TILE_TYPE.WALL, width: 1, height: 1 },
  'environment/DirectionsSign_64.png': { type: TILE_TYPE.WALL, width: 1, height: 1 },
  'environment/HangingLantern_64.png': { type: TILE_TYPE.DECORATION, width: 1, height: 1 },
  'environment/Shrub_64.png': { type: TILE_TYPE.WALL, width: 1, height: 1 },
  'environment/Shrub_palette2_64.png': { type: TILE_TYPE.WALL, width: 1, height: 1 },
  'environment/StallItem1_64.png': { type: TILE_TYPE.WALL, width: 2, height: 2 },
  'environment/StallOther1_64.png': { type: TILE_TYPE.WALL, width: 2, height: 2 },
  'environment/StallOther2_64.png': { type: TILE_TYPE.WALL, width: 2, height: 2 },
  'environment/StallOther_palette2_64.png': { type: TILE_TYPE.WALL, width: 2, height: 2 },
  'environment/StallOtherWide_64.png': { type: TILE_TYPE.WALL, width: 4, height: 2 },
};

const ITEM_TILES = {
  'item/food1_64.png': { type: TILE_TYPE.ITEM, width: 1, height: 1 },
};

const COMBINED_TILES = {};
Object.assign(
  COMBINED_TILES,
  GROUND_TILES,
  BRICK_TILES,
  HOLE_BACKGROUND_TILES,
  HOLE_EDGE_TILES,
  CHARACTER_TILES,
  HOME_TILES,
  ENVIRONMENT_TILES,
  ITEM_TILES
);

export {
  GROUND_TILES,
  BRICK_TILES,
  HOLE_BACKGROUND_TILES,
  HOLE_EDGE_TILES,
  CHARACTER_TILES,
  HOME_TILES,
  ENVIRONMENT_TILES,
  ITEM_TILES,
  TILE_TYPE,
  COMBINED_TILES,
};
