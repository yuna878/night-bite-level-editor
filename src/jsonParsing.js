/* eslint-disable no-plusplus */
/* eslint-disable spaced-comment */
import { COMBINED_TILES, TILE_TYPE, ENVIRONMENT_TILES, BRICK_TILES } from './tiles';

let largeAssetIndicatorGlobal;

function isLargeAssetTopLeft(rowInd, colInd) {
  const assetInfo = largeAssetIndicatorGlobal[rowInd][colInd];
  return assetInfo[2] === 0 && assetInfo[3] === 0;
}

function isLargeAsset(path) {
  return COMBINED_TILES[path].width > 1 || COMBINED_TILES[path].height > 1;
}

// Helper for stateToJson
function processTileInfo(tile, light, x, y) {
  let { texture, flip, rotate } = tile;
  flip = flip === -1; // flip to boolean
  rotate /= 90; // degrees to number of 90deg turns

  // Get appropriate name depending on tile type
  const { type } = COMBINED_TILES[texture];
  let name;
  switch (type) {
    case TILE_TYPE.TEAM:
    case TILE_TYPE.CHARACTER:
      name = COMBINED_TILES[texture].team;
      break;
    default:
      name = `${type}_${x}_${y}`;
      break;
  }

  // If enemy, set enemy type
  const enemyType = type === TILE_TYPE.ENEMY ? COMBINED_TILES[texture].enemyType : null;

  // Return tile information
  return {
    name,
    texture,
    flip,
    rotate,
    type,
    light,
    enemyType,
  };
}

function stateToJson(state) {
  let { boardRows, boardCols, board, largeAssetIndicator, lightIndicator, timeLimit } = state;

  /**** Reverse board : level editor coordinates -> game coordinates ****/
  board = [...board].reverse();
  largeAssetIndicator = [...largeAssetIndicator].reverse();
  lightIndicator = [...lightIndicator].reverse();

  largeAssetIndicatorGlobal = largeAssetIndicator;

  /**** Board information ****/
  const tiles = {
    height: 64,
    width: 64,
    rows: boardRows,
    columns: boardCols,
    coordinateAdjusted: true,
  };

  /**** Loop through each tile and generate 3d array of asset information ****/
  const assets = [];

  // loop through each coordinate
  for (let y = 0; y < boardRows; y++) {
    const newRow = [];
    for (let x = 0; x < boardCols; x++) {
      const currentCoord = [];
      const { background, brick, lantern, object } = board[y][x];
      let light = lightIndicator[y][x];

      /*********** Overlay ***********/
      if (object) {
        // Skip if part of large asset
        const partOfLargeAsset = isLargeAsset(object.texture) && !isLargeAssetTopLeft(y, x);
        if (!partOfLargeAsset) {
          currentCoord.unshift(processTileInfo(object, light, x, y));
          light = false; // Avoid double processing of light for object & decoration
        }
      }
      /*********** Lantern ***********/
      if (lantern) {
        currentCoord.unshift(processTileInfo(lantern, light, x, y));
      }
      /*********** Brick ***********/
      if (brick) {
        currentCoord.unshift(processTileInfo(brick, false, x, y)); // Always no light
      }
      /*********** Background ***********/
      currentCoord.unshift(processTileInfo(background, false, x, y)); // Always no light

      // Finished processing a tile
      newRow.push(currentCoord);
    }
    //Finished processing a row
    assets.push(newRow);
  }

  return {
    timeLimit: timeLimit || 120,
    tiles,
    assets,
  };
}

async function jsonToState(dataStr, newBoards) {
  try {
    const text = await dataStr.text();
    const { board, largeAssetIndicator, lightIndicator } = newBoards;
    const { timeLimit, tiles, assets } = JSON.parse(text);
    const { rows, columns } = tiles;

    /**** Reverse board : game coordinates -> level editor coordinates ****/
    if (tiles.hasOwnProperty('coordinateAdjusted')) {
      assets.reverse();
    }

    // loop through each coordinate
    for (let rowInd = 0; rowInd < rows; rowInd++) {
      for (let colInd = 0; colInd < columns; colInd++) {
        const assetArr = assets[rowInd][colInd];
        // loop through all assets on the x,y coordinate
        for (let ind = 0; ind < assetArr.length; ind++) {
          // process information
          let { texture, flip, rotate, light } = assetArr[ind];
          const { type } = COMBINED_TILES[texture];

          flip = flip ? -1 : 1; // boolean to flip
          rotate = (rotate * 90) % 360; //  number of 90deg turns to total degree of rotation
          const tileInfo = { texture, flip, rotate };

          // Update board depending on tile type
          if (type === TILE_TYPE.GROUND || type === TILE_TYPE.HOLE) {
            /*********** Background ***********/
            board[rowInd][colInd].background = tileInfo;
          } else if (type === TILE_TYPE.DECORATION && BRICK_TILES.hasOwnProperty(texture)) {
            /*********** Brick ***********/
            board[rowInd][colInd].brick = tileInfo;
          } else if (type === TILE_TYPE.DECORATION && ENVIRONMENT_TILES.hasOwnProperty(texture)) {
            /*********** Lantern ***********/
            board[rowInd][colInd].lantern = tileInfo;
            lightIndicator[rowInd][colInd] = lightIndicator[rowInd][colInd] || light; // Update light information
          } else {
            /*********** Overlay ***********/
            const sizeWidth = COMBINED_TILES[texture].width;
            const sizeHeight = COMBINED_TILES[texture].height;
            lightIndicator[rowInd][colInd] = lightIndicator[rowInd][colInd] || light; // Update light information for top-left coordinate
            // Mainly for large assets -> Go through all coordinates that is covered by the asset
            for (let i = 0; i < sizeHeight; i++) {
              for (let j = 0; j < sizeWidth; j++) {
                const newRowInd = rowInd + i;
                const newColInd = colInd + j;
                // Check new coordinate is in bounds of board
                if (newRowInd < rows && newColInd < columns) {
                  // Skip if large asset should be rendered, but there is already another overlay asset
                  if (isLargeAsset(texture) && board[newRowInd][newColInd].object) {
                    continue;
                  }
                  board[newRowInd][newColInd].object = tileInfo;
                  largeAssetIndicator[newRowInd][newColInd] = [sizeWidth, sizeHeight, i, j];
                }
              }
            }
          }
        }
      }
    }

    return {
      board,
      largeAssetIndicator,
      lightIndicator,
      timeLimit,
    };
  } catch (err) {
    alert(`*** FAILED PARSING FILE ***\n${err}`);
    return null;
  }
}

function assetToJson() {
  const assets = {};
  Object.keys(COMBINED_TILES).forEach((tile) => {
    const { type } = COMBINED_TILES[tile];
    if (assets[type]) {
      assets[type].push(tile);
    } else {
      assets[type] = [tile];
    }
  });
  return assets;
}

export { stateToJson, jsonToState, assetToJson };
