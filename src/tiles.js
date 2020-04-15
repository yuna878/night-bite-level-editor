const TILE_TYPE = {
  GROUND: 'ground',
  WALL: 'wall',
  HOLE: 'hole',
  TEAM: 'team',
  ITEM: 'item',
  CHARACTER: 'character',
  DECORATION: 'decoration',
};

const BACKGROUND_TILES = {
  'background/ground_64.png': { type: TILE_TYPE.GROUND, size: 1 },
  'background/groundbrick_64.png': { type: TILE_TYPE.GROUND, size: 1 },
  // palette 2
  'background/ground_palette2_64.png': { type: TILE_TYPE.GROUND, size: 1 },
  'background/grounddark1_palette2_64.png': { type: TILE_TYPE.GROUND, size: 1 },
  'background/grounddark2_palette2_64.png': { type: TILE_TYPE.GROUND, size: 1 },
  'background/groundbrick_palette2_64.png': { type: TILE_TYPE.GROUND, size: 1 },
  'background/groundgrass_palette2_64.png': { type: TILE_TYPE.GROUND, size: 1 },
};

const ITEM_TILES = {
  'item/food1_64.png': { type: TILE_TYPE.ITEM, size: 1 },
};

const HOME_TILES = {
  'environment/StallHome1_64.png': { type: TILE_TYPE.TEAM, size: 2, team: 'teamA' },
  'environment/StallHome2_64.png': { type: TILE_TYPE.TEAM, size: 2, team: 'teamB' },
  'environment/StallHome3_64.png': { type: TILE_TYPE.TEAM, size: 2, team: 'teamC' },
  'environment/StallHome4_64.png': { type: TILE_TYPE.TEAM, size: 2, team: 'teamD' },
};

const WALL_TILES = {
  'background/hole0_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '0' },
  'background/hole1_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '1' },
  'background/hole2opp_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '2-opp' },
  'background/hole2adj_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '2-adj' },
  'background/hole3_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '3' },
  'background/hole4_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '4' },
  // palette 2 holes
  'background/hole0_palette2_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '0' },
  'background/hole1_palette2_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '1' },
  'background/hole2opp_palette2_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '2-opp' },
  'background/hole2adj_palette2_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '2-adj' },
  'background/hole3_palette2_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '3' },
  'background/hole4_palette2_64.png': { type: TILE_TYPE.HOLE, size: 1, label: '4' },
  // ***
  'environment/Box_64.png': { type: TILE_TYPE.WALL, size: 1 },
  'environment/box_palette2_64.png': { type: TILE_TYPE.WALL, size: 1 },
  'environment/DirectionsSign_64.png': { type: TILE_TYPE.WALL, size: 1 },
  'environment/HangingLantern_64.png': { type: TILE_TYPE.DECORATION, size: 1 },
  'environment/Shrub_64.png': { type: TILE_TYPE.WALL, size: 1 },
  'environment/Shrub_palette2_64.png': { type: TILE_TYPE.WALL, size: 1 },
  'environment/StallItem1_64.png': { type: TILE_TYPE.WALL, size: 2 },
  'environment/StallOther1_64.png': { type: TILE_TYPE.WALL, size: 2 },
  'environment/StallOther2_64.png': { type: TILE_TYPE.WALL, size: 2 },
  'environment/StallOther_palette2_64.png': { type: TILE_TYPE.WALL, size: 2 },
};

const CHARACTER_TILES = {
  'character/P1_64.png': { type: TILE_TYPE.CHARACTER, size: 1, team: 'teamA' },
  'character/P2_64_v2.png': { type: TILE_TYPE.CHARACTER, size: 1, team: 'teamB' },
  'character/P3_64_v2.png': { type: TILE_TYPE.CHARACTER, size: 1, team: 'teamC' },
  'character/P4_64.png': { type: TILE_TYPE.CHARACTER, size: 1, team: 'teamD' },
};

const COMBINED_TILES = {};
Object.assign(
  COMBINED_TILES,
  BACKGROUND_TILES,
  ITEM_TILES,
  HOME_TILES,
  WALL_TILES,
  CHARACTER_TILES
);

export {
  BACKGROUND_TILES,
  ITEM_TILES,
  HOME_TILES,
  WALL_TILES,
  CHARACTER_TILES,
  TILE_TYPE,
  COMBINED_TILES,
};
