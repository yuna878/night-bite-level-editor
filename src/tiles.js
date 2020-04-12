const TILE_TYPE = {
  GROUND: 'ground',
  WALL: 'wall',
  HOLE: 'hole',
  TEAM: 'team',
  ITEM: 'item',
};

const BACKGROUND_TILES = {
  'background/ground_64.png': { type: TILE_TYPE.GROUND, size: 1 },
  'background/groundbrick_64.png': { type: TILE_TYPE.GROUND, size: 1 },
};

const ITEM_TILES = {};

const HOME_TILES = {
  'environment/StallHome1_64.png': { type: TILE_TYPE.TEAM, size: 2 },
  'environment/StallHome2_64.png': { type: TILE_TYPE.TEAM, size: 2 },
  'environment/StallHome3_64.png': { type: TILE_TYPE.TEAM, size: 2 },
  'environment/StallHome4_64.png': { type: TILE_TYPE.TEAM, size: 2 },
};
const WALL_TILES = {
  'background/hole3_64.png': { type: TILE_TYPE.HOLE, size: 1 },
  'environment/Box_64.png': { type: TILE_TYPE.WALL, size: 1 },
  'environment/DirectionsSign_64.png': { type: TILE_TYPE.WALL, size: 1 },
  'environment/HangingLantern_64.png': { type: TILE_TYPE.WALL, size: 1 },
  'environment/Shrub_64.png': { type: TILE_TYPE.WALL, size: 1 },
  'environment/StallItem1_64.png': { type: TILE_TYPE.WALL, size: 2 },
  'environment/StallOther1_64.png': { type: TILE_TYPE.WALL, size: 2 },
};

export { BACKGROUND_TILES, ITEM_TILES, HOME_TILES, WALL_TILES, TILE_TYPE };
