/* eslint-disable no-plusplus */
/* eslint-disable spaced-comment */
import { COMBINED_TILES, TILE_TYPE } from './tiles';

function stateToJson(state) {
  // this.state = {
  //   boardRows: 12,
  //   boardCols: 25,
  //   board: [], // 2d array where each element is an array strings of path to asset
  //   selectedAsset: 'background/ground_64.png',
  //   selectedAssetIsBackground: true,
  //   selectedAssetFlipStatus: 1, // 1: normal ; -1: flipped horizontally
  //   selectedAssetRotateStatus: 0, // Degrees
  //   selectedAssetSizeRatio: 1,
  //   assetBoardBackground: [],
  //   assetBoardItem: [],
  //   assetBoardHome: [],
  //   assetBoardWall: [],
  //   flipAssetIndicator: [], // 2d array where each element is an array of ints indicating flip status
  //   rotateAssetIndicator: [], // 2d array where each element is array of ints indicating degree of rotation
  //   largeAssetIndicator: [], // 2d array where each element is null or [size, x_coord, y_coord] for top-most image
  //   fileName: null, // file name for saving level json
  // };
  const { boardRows, boardCols, board, flipAssetIndicator, rotateAssetIndicator } = state;

  /**** BOARD INFORMATION ****/
  const tiles = {
    height: 64,
    width: 64,
    rows: boardRows,
    columns: boardCols,
  };

  /**** Loop through each tile and put into appropriate type's dictionary ****/
  const grounds = {};
  const holes = {};
  const walls = {};
  const teams = {};
  const items = {};

  // loop through each coordinate
  for (let x = 0; x < boardRows; x++) {
    for (let y = 0; y < boardCols; y++) {
      // loop through all assets on the x,y coordinate
      const assetArr = board[x][y];
      for (let ind = 0; ind < assetArr.length; ind++) {
        const path = assetArr[ind];
        const flip = flipAssetIndicator[x][y][ind] === -1;
        const rotate = rotateAssetIndicator[x][y][ind] % 90;

        switch (COMBINED_TILES[path].type) {
          case TILE_TYPE.GROUND:
            grounds[`ground_${x}_${y}`] = {
              x,
              y,
              asset: path,
              flip,
              rotate,
            };
            break;
          case TILE_TYPE.HOLE:
            holes[`hole_${x}_${y}`] = {
              x,
              y,
              asset: path,
              flip,
              rotate,
              // texture,
            };
            break;
          case TILE_TYPE.WALL:
            walls[`wall_${x}_${y}`] = {
              x,
              y,
              asset: path,
              flip,
              rotate,
              // texture,
            };
            break;
          case TILE_TYPE.TEAM:
            teams[`team_${x}_${y}`] = {
              x,
              y,
              asset: path,
              flip,
              rotate,
            };
            break;
          case TILE_TYPE.ITEM:
            items[`item_${x}_${y}`] = {
              x,
              y,
              asset: path,
              flip,
              rotate,
            };
            break;
          default:
            break;
        }
      }
    }
  }

  return {
    tiles,
    grounds,
    walls,
    holes,
    teams,
    items,
  };
}

export { stateToJson };
