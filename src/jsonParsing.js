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

  /**** Loop through each tile and generate 3d array of asset information ****/
  const assets = [];

  // loop through each coordinate
  for (let y = 0; y < boardRows; y++) {
    const newRow = [];
    for (let x = 0; x < boardCols; x++) {
      const currentCoord = [];
      const assetArr = board[y][x];
      // loop through all assets on the x,y coordinate
      for (let ind = 0; ind < assetArr.length; ind++) {
        const path = assetArr[ind];
        const flip = flipAssetIndicator[y][x][ind] === -1; // flip to boolean
        const rotate = rotateAssetIndicator[y][x][ind] / 90; // degrees to number of 90deg turns

        // Skip if part of large asset
        if (ind > 0 && isLargeAsset(path) && !isLargeAssetTopLeft(y, x)) {
          continue;
        }

        // Get appropriate name depending on tile type
        const { type } = COMBINED_TILES[path];
        let name;
        switch (type) {
          case TILE_TYPE.TEAM || TILE_TYPE.CHARACTER:
            name = COMBINED_TILES[path].team;
            break;
          default:
            name = `${type}_${x}_${y}`;
            break;
        }

        // Add to current coordinate array
        currentCoord.push({
          name,
          texture: path,
          flip,
          rotate,
        });
      }
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
    const { board, flipAssetIndicator, rotateAssetIndicator, largeAssetIndicator } = newBoards;
    const { tiles, assets } = JSON.parse(text);
    const { rows, columns } = tiles;

    // loop through each coordinate
    for (let rowInd = 0; rowInd < rows; rowInd++) {
      for (let colInd = 0; colInd < columns; colInd++) {
        const assetArr = assets[rowInd][colInd];
        // loop through all assets on the x,y coordinate
        for (let ind = 0; ind < assetArr.length; ind++) {
          const { texture, flip, rotate } = assetArr[ind];
          if (ind === 0) {
            /*********** Ground Tiles ***********/
            board[rowInd][colInd][0] = texture;
            flipAssetIndicator[rowInd][colInd][0] = flip ? -1 : 1; // boolean to flip
            rotateAssetIndicator[rowInd][colInd][0] = rotate * 90; //  number of 90deg turns to total degree of rotation
          } else {
            /*********** Non-ground Tiles ***********/
            const sizeWidth = COMBINED_TILES[texture].width;
            const sizeHeight = COMBINED_TILES[texture].height;
            // Mainly for large assets -> Go through all coordinates that is covered by the asset
            for (let i = 0; i < sizeHeight; i++) {
              for (let j = 0; j < sizeWidth; j++) {
                const newRowInd = rowInd + i;
                const newColInd = colInd + j;
                // Check new coordinate is in bounds of board
                if (newRowInd < rows && newColInd < columns) {
                  // Skip if large asset should be rendered, but there is already another overlay asset
                  if (isLargeAsset(texture) && board[newRowInd][newColInd].length > 1) {
                    continue;
                  }
                  // Clear out existing info, if any
                  if (board[newRowInd][newColInd].length !== 1) {
                    board[newRowInd][newColInd].pop();
                    flipAssetIndicator[newRowInd][newColInd].pop();
                    rotateAssetIndicator[newRowInd][newColInd].pop();
                  }
                  // Update all information
                  board[newRowInd][newColInd].push(texture);
                  flipAssetIndicator[newRowInd][newColInd].push(flip ? -1 : 1); // boolean to flip
                  rotateAssetIndicator[newRowInd][newColInd].push(rotate * 90); //  number of 90deg turns to total degree of rotation
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
      flipAssetIndicator,
      rotateAssetIndicator,
      largeAssetIndicator,
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
