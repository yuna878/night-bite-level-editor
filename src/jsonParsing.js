/* eslint-disable no-plusplus */
/* eslint-disable spaced-comment */
import { COMBINED_TILES, TILE_TYPE } from './tiles';

let largeAssetIndicatorGlobal;

function isLargeAssetTopLeft(rowInd, colInd) {
  const assetInfo = largeAssetIndicatorGlobal[rowInd][colInd];
  return assetInfo[2] === 0 && assetInfo[3] === 0;
}

function isLargeAsset(path) {
  return COMBINED_TILES[path].width > 1 || COMBINED_TILES[path].height > 1;
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
  for (let y = 0; y < boardRows; y++) {
    for (let x = 0; x < boardCols; x++) {
      // loop through all assets on the x,y coordinate
      const assetArr = board[y][x];
      for (let ind = 0; ind < assetArr.length; ind++) {
        const path = assetArr[ind];
        const flip = flipAssetIndicator[y][x][ind] === -1; // flip to boolean
        const rotate = rotateAssetIndicator[y][x][ind] / 90; // degrees to number of 90deg turns

        if (ind > 0 && isLargeAsset(path) && !isLargeAssetTopLeft(y, x)) {
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
      console.log(tile);
      board[y][x][0] = texture;
      flipAssetIndicator[y][x][0] = flip ? -1 : 1; // boolean to flip
      rotateAssetIndicator[y][x][0] = rotate * 90; //  number of 90deg turns to total degree of rotation
    });

    /*********** Non-ground Tiles ***********/
    for (var tilesObj of nongrounds) {
      Object.keys(tilesObj).forEach((tile) => {
        console.log(tile);
        const { x, y, texture, flip, rotate } = tilesObj[tile];
        const sizeWidth = COMBINED_TILES[texture].width;
        const sizeHeight = COMBINED_TILES[texture].height;
        for (let i = 0; i < sizeHeight; i++) {
          for (let j = 0; j < sizeWidth; j++) {
            const newY = y + i;
            const newX = x + j;
            if (newY < rows && newX < columns) {
              if (isLargeAsset(texture) && board[newY][newX].length > 1) {
                continue;
              }
              largeAssetIndicator[newY][newX] = [sizeWidth, sizeHeight, i, j];
              if (board[newY][newX].length !== 1) {
                board[newY][newX].pop();
                flipAssetIndicator[newY][newX].pop();
                rotateAssetIndicator[newY][newX].pop();
              }
              board[newY][newX].push(texture);
              flipAssetIndicator[newY][newX].push(flip ? -1 : 1); // boolean to flip
              rotateAssetIndicator[newY][newX].push(rotate * 90); //  number of 90deg turns to total degree of rotation
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
