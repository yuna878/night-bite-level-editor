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
  const { boardRows, boardCols, board, largeAssetIndicator, lightIndicator } = state;
  largeAssetIndicatorGlobal = largeAssetIndicator;

  /**** Reverse board : level editor coordinates -> game coordinates ****/
  board.reverse();
  largeAssetIndicator.reverse();
  lightIndicator.reverse();

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
      const { background, decoration, object } = board[y][x];
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
      /*********** Decoration ***********/
      if (decoration) {
        currentCoord.unshift(processTileInfo(decoration, light, x, y));
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
    tiles,
    assets,
  };
}

async function jsonToState(dataStr, newBoards) {
  try {
    const text = await dataStr.text();
    const { board, largeAssetIndicator, lightIndicator } = newBoards;
    const { tiles, assets } = JSON.parse(text);
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
          let { texture, flip, rotate, type, light } = assetArr[ind];
          flip = flip ? -1 : 1; // boolean to flip
          rotate *= 90; //  number of 90deg turns to total degree of rotation
          const tileInfo = { texture, flip, rotate };

          // Update board depending on tile type
          if (type === TILE_TYPE.GROUND) {
            /*********** Background ***********/
            board[rowInd][colInd].background = tileInfo;
          } else if (type === TILE_TYPE.DECORATION) {
            /*********** Decoration ***********/
            board[rowInd][colInd].decoration = tileInfo;
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
