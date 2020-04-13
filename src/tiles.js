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
  'background/hole6_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '0' },
  'background/hole5_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '1' },
  'background/hole3_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '2-opp' },
  'background/hole4_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '2-adj' },
  'background/hole1_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '3' },
  'background/hole2_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '4' },
  'environment/Box_64.png': { type: TILE_TYPE.WALL, size: 1 },
  'environment/DirectionsSign_64.png': { type: TILE_TYPE.WALL, size: 1 },
  'environment/HangingLantern_64.png': { type: TILE_TYPE.WALL, size: 1 },
  'environment/Shrub_64.png': { type: TILE_TYPE.WALL, size: 1 },
  'environment/StallItem1_64.png': { type: TILE_TYPE.WALL, size: 2 },
  'environment/StallOther1_64.png': { type: TILE_TYPE.WALL, size: 2 },
};

const COMBINED_TILES = {};
Object.assign(COMBINED_TILES, BACKGROUND_TILES, ITEM_TILES, HOME_TILES, WALL_TILES);

export { BACKGROUND_TILES, ITEM_TILES, HOME_TILES, WALL_TILES, TILE_TYPE, COMBINED_TILES };
