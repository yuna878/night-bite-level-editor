/* eslint-disable no-plusplus */
/* eslint-disable spaced-comment */
import { COMBINED_TILES, TILE_TYPE } from './tiles';

let largeAssetIndicatorGlobal;

function isLargeAssetTopLeft(x, y) {
  const assetInfo = largeAssetIndicatorGlobal[x][y];
  console.log(assetInfo, x, y);
  return assetInfo[1] === 0 && assetInfo[2] === 0;
}

function isLargeAsset(path) {
  return COMBINED_TILES[path].size > 1;
}

function stateToJson(state) {
  const {
    boardRows,
    boardCols,
    board,
    flipAssetIndicator,
    rotateAssetIndicator,
    largeAssetIndicator,
  } = state;
  largeAssetIndicatorGlobal = largeAssetIndicator;

  /**** Board information ****/
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
  const characters = {};
  const items = {};
  const decorations = {};

  // loop through each coordinate
  for (let x = 0; x < boardRows; x++) {
    for (let y = 0; y < boardCols; y++) {
      // loop through all assets on the x,y coordinate
      const assetArr = board[x][y];
      for (let ind = 0; ind < assetArr.length; ind++) {
        const path = assetArr[ind];
        const flip = flipAssetIndicator[x][y][ind] === -1; // flip to boolean
        const rotate = rotateAssetIndicator[x][y][ind] / 90; // degrees to number of 90deg turns

        if (ind > 0 && isLargeAsset(path) && !isLargeAssetTopLeft(x, y)) {
          continue;
        }

        switch (COMBINED_TILES[path].type) {
          case TILE_TYPE.GROUND:
            grounds[`ground_${x}_${y}`] = {
              x,
              y,
              texture: path,
              flip,
              rotate,
            };
            break;
          case TILE_TYPE.HOLE:
            holes[`hole_${x}_${y}`] = {
              x,
              y,
              texture: path,
              flip,
              rotate,
            };
            break;
          case TILE_TYPE.WALL:
            walls[`wall_${x}_${y}`] = {
              x,
              y,
              texture: path,
              flip,
              rotate,
            };
            break;
          case TILE_TYPE.TEAM:
            teams[COMBINED_TILES[path].team] = {
              x,
              y,
              texture: path,
              flip,
              rotate,
            };
            break;
          case TILE_TYPE.CHARACTER:
            characters[COMBINED_TILES[path].team] = {
              x,
              y,
              texture: path,
              flip,
              rotate,
            };
            break;
          case TILE_TYPE.ITEM:
            items[`item_${x}_${y}`] = {
              x,
              y,
              texture: path,
              flip,
              rotate,
            };
            break;
          case TILE_TYPE.DECORATION:
            decorations[`decoration_${x}_${y}`] = {
              x,
              y,
              texture: path,
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
    characters,
    items,
    decorations,
  };
}

async function jsonToState(dataStr, newBoards) {
  try {
    const text = await dataStr.text();
    const { board, flipAssetIndicator, rotateAssetIndicator, largeAssetIndicator } = newBoards;
    const { tiles, grounds, walls, holes, teams, characters, items, decorations } = JSON.parse(
      text
    );
    const { rows, columns } = tiles;

    const nongrounds = [walls, holes, teams, characters, items, decorations];

    /*********** Ground Tiles ***********/
    Object.keys(grounds).forEach((tile) => {
      const { x, y, texture, flip, rotate } = grounds[tile];
      board[x][y][0] = texture;
      flipAssetIndicator[x][y][0] = flip ? -1 : 1; // boolean to flip
      rotateAssetIndicator[x][y][0] = rotate * 90; //  number of 90deg turns to total degree of rotation
    });

    /*********** Non-ground Tiles ***********/
    for (var tilesObj of nongrounds) {
      Object.keys(tilesObj).forEach((tile) => {
        const { x, y, texture, flip, rotate } = tilesObj[tile];
        const sizeRatio = COMBINED_TILES[texture].size;
        for (let i = 0; i < sizeRatio; i++) {
          for (let j = 0; j < sizeRatio; j++) {
            const newX = x + i;
            const newY = y + j;
            if (newX < rows && newY < columns) {
              if (isLargeAsset(texture) && board[newX][newY].length > 1) {
                continue;
              }
              largeAssetIndicator[newX][newY] = [sizeRatio, i, j];
              if (board[newX][newY].length !== 1) {
                board[newX][newY].pop();
                flipAssetIndicator[newX][newY].pop();
                rotateAssetIndicator[newX][newY].pop();
              }
              board[newX][newY].push(texture);
              flipAssetIndicator[newX][newY].push(flip ? -1 : 1); // boolean to flip
              rotateAssetIndicator[newX][newY].push(rotate * 90); //  number of 90deg turns to total degree of rotation
            }
          }
        }
      });
    }

    return {
      board,
      flipAssetIndicator,
      rotateAssetIndicator,
      largeAssetIndicator,
    };
  } catch (err) {
    alert(`*** FAILED PARSING FILE ***\n${err}`);
    return null;
  }
}

export { stateToJson, jsonToState };
