/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
import React from 'react';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import {
  BACKGROUND_TILES,
  ITEM_TILES,
  HOME_TILES,
  WALL_TILES,
  CHARACTER_TILES,
  COMBINED_TILES,
  TILE_TYPE,
} from './tiles';
import { stateToJson, jsonToState } from './jsonParsing';

const ASSETBOARD_COLS = 4;
const GAMESQUARE_SIZE = 50; // From CSS .GameBoard-square size (in px)
const DEFAULT_SELECTED_ASSET = 'background/ground_64.png';
const DEFAULT_SELECTED_ASSET_IS_BACKGROUND = true;
const DEFAULT_SELECTED_ASSET_FLIP_STATUS = 1;
const DEFAULT_SELECTED_ASSET_ROTATE_STATUS = 0;
const DEFAULT_SELECTED_ASSET_SIZE_RATIO = 1;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardRows: 12,
      boardCols: 25,
      board: [], // 2d array where each element is an array strings of path to asset
      selectedAsset: DEFAULT_SELECTED_ASSET,
      selectedAssetIsBackground: DEFAULT_SELECTED_ASSET_IS_BACKGROUND,
      selectedAssetFlipStatus: DEFAULT_SELECTED_ASSET_FLIP_STATUS, // 1: normal ; -1: flipped horizontally
      selectedAssetRotateStatus: DEFAULT_SELECTED_ASSET_ROTATE_STATUS, // Degrees
      selectedAssetSizeRatio: DEFAULT_SELECTED_ASSET_SIZE_RATIO,
      assetBoardBackground: [],
      assetBoardItem: [],
      assetBoardHome: [],
      assetBoardWall: [],
      assetBoardCharacter: [],
      flipAssetIndicator: [], // 2d array where each element is an array of ints indicating flip status
      rotateAssetIndicator: [], // 2d array where each element is array of ints indicating degree of rotation
      largeAssetIndicator: [], // 2d array where each element is null or [size, x_coord relative to image, y_coord relative to image]
      fileName: null, // file name for saving level json
      eraseMode: false,
    };

    this.handleFileNamechange = this.handleFileNamechange.bind(this);
  }

  // On startup
  componentDidMount() {
    // Initialize board
    this.resetBoard();
    // Initialize assets
    let assetBoardBackground = this.initializeAsset(BACKGROUND_TILES);
    let assetBoardItem = this.initializeAsset(ITEM_TILES);
    let assetBoardHome = this.initializeAsset(HOME_TILES);
    let assetBoardWall = this.initializeAsset(WALL_TILES);
    let assetBoardCharacter = this.initializeAsset(CHARACTER_TILES);
    this.setState({
      assetBoardBackground,
      assetBoardItem,
      assetBoardHome,
      assetBoardWall,
      assetBoardCharacter,
    });
  }

  // Initialize a list of assets for a category
  initializeAsset(assetDict) {
    let newBoard = [];
    const assetList = Object.keys(assetDict);
    while (assetList.length !== 0) {
      newBoard.push(assetList.splice(0, ASSETBOARD_COLS));
    }
    return newBoard;
  }

  // Initialize all asset boards with given values
  initializeGameBoards(asset, assetFlipStatus, assetRotateStatus) {
    const { boardRows, boardCols } = this.state;
    let board = [];
    let flipAssetIndicator = [];
    let rotateAssetIndicator = [];
    let largeAssetIndicator = [];
    for (let i = 0; i < boardRows; i++) {
      let newRow = [];
      let newFlipRow = [];
      let newRotateRow = [];
      let newLargeRow = [];
      for (let j = 0; j < boardCols; j++) {
        newRow.push([asset]);
        newFlipRow.push([assetFlipStatus]);
        newRotateRow.push([assetRotateStatus]);
        newLargeRow.push(null);
      }
      board.push(newRow);
      flipAssetIndicator.push(newFlipRow);
      rotateAssetIndicator.push(newRotateRow);
      largeAssetIndicator.push(newLargeRow);
    }
    return {
      board,
      flipAssetIndicator,
      rotateAssetIndicator,
      largeAssetIndicator,
    };
  }

  // Clear entire game board
  resetBoard() {
    const { selectedAsset, selectedAssetFlipStatus, selectedAssetRotateStatus } = this.state;
    this.setState(
      this.initializeGameBoards(selectedAsset, selectedAssetFlipStatus, selectedAssetRotateStatus)
    );
  }

  // Change selected square in game board to display selected asset
  handleGameSquareClick(rowInd, colInd) {
    let {
      board,
      boardRows,
      boardCols,
      selectedAsset,
      selectedAssetIsBackground,
      selectedAssetFlipStatus,
      selectedAssetRotateStatus,
      selectedAssetSizeRatio,
      flipAssetIndicator,
      rotateAssetIndicator,
      largeAssetIndicator,
      eraseMode,
    } = this.state;

    if (eraseMode) {
      if (board[rowInd][colInd].length !== 1) {
        board[rowInd][colInd].pop();
        flipAssetIndicator[rowInd][colInd].pop();
        rotateAssetIndicator[rowInd][colInd].pop();
      }
    } else {
      // Go through all tile coordinates that the asset should cover
      for (let i = 0; i < selectedAssetSizeRatio; i++) {
        for (let j = 0; j < selectedAssetSizeRatio; j++) {
          let x = rowInd + i;
          let y = colInd + j;
          if (x < boardRows && y < boardCols) {
            // Update boards depending on whether selected asset is a background tile
            if (selectedAssetIsBackground) {
              board[x][y][0] = selectedAsset;
              flipAssetIndicator[x][y][0] = selectedAssetFlipStatus;
              rotateAssetIndicator[x][y][0] = selectedAssetRotateStatus;
            } else {
              largeAssetIndicator[x][y] = [selectedAssetSizeRatio, i, j];
              if (board[x][y].length !== 1) {
                board[x][y].pop();
                flipAssetIndicator[x][y].pop();
                rotateAssetIndicator[x][y].pop();
              }
              board[x][y].push(selectedAsset);
              flipAssetIndicator[x][y].push(selectedAssetFlipStatus);
              rotateAssetIndicator[x][y].push(selectedAssetRotateStatus);
            }
          }
        }
      }
    }
    this.setState({
      board,
      flipAssetIndicator,
      rotateAssetIndicator,
      largeAssetIndicator,
    });
  }

  generateMargin(assetInfo) {
    const x = assetInfo[1];
    const y = assetInfo[2];
    return `${-GAMESQUARE_SIZE * x}px 0px 0px ${-GAMESQUARE_SIZE * y}px`;
  }

  // Helper to render game board's individual rows
  renderGameRow(row, rowInd) {
    const { flipAssetIndicator, rotateAssetIndicator, largeAssetIndicator } = this.state;

    return row.map((path, colInd) => {
      const largeAsset = largeAssetIndicator[rowInd][colInd];

      // Background tile only
      if (path.length === 1) {
        return (
          <div className="GameBoard-square">
            <img
              row={rowInd}
              col={colInd}
              src={require(`./assets/${path[0]}`)}
              style={{
                transform: `scaleX(${flipAssetIndicator[rowInd][colInd][0]}) rotate(${rotateAssetIndicator[rowInd][colInd][0]}deg)`,
              }}
              onClick={() => this.handleGameSquareClick(rowInd, colInd)}
            />
          </div>
        );
      }
      // Background + overlay
      return (
        <div className="GameBoard-square">
          <img
            className="image1"
            row={rowInd}
            col={colInd}
            src={require(`./assets/${path[0]}`)}
            style={{
              transform: `scaleX(${flipAssetIndicator[rowInd][colInd][0]}) rotate(${rotateAssetIndicator[rowInd][colInd][0]}deg)`,
            }}
            onClick={() => this.handleGameSquareClick(rowInd, colInd)}
          />
          <img
            className="image2"
            row={rowInd}
            col={colInd}
            src={require(`./assets/${path[1]}`)}
            style={{
              transform: `scaleX(${flipAssetIndicator[rowInd][colInd][1]}) rotate(${rotateAssetIndicator[rowInd][colInd][1]}deg)`,
              height: `${largeAsset ? largeAsset[0] * GAMESQUARE_SIZE : null}px`,
              width: `${largeAsset ? largeAsset[0] * GAMESQUARE_SIZE : null}px`,
              margin: `${largeAsset ? this.generateMargin(largeAsset) : null}`,
            }}
            onClick={() => this.handleGameSquareClick(rowInd, colInd)}
          />
        </div>
      );
    });
  }

  // Helper to render game board
  renderGameBoard() {
    const { board } = this.state;
    return board.map((val, ind) => (
      <div className="GameBoard-row">{this.renderGameRow(val, ind)}</div>
    ));
  }

  // Change selected asset
  handleAssetSquareClick(path) {
    let selectedAssetIsBackground = COMBINED_TILES[path].type === TILE_TYPE.GROUND;

    this.setState({
      selectedAsset: path,
      selectedAssetIsBackground,
      selectedAssetFlipStatus: 1,
      selectedAssetRotateStatus: 0,
      selectedAssetSizeRatio: COMBINED_TILES[path].size,
      eraseMode: false,
    });
  }

  // Helper to render asset board's individual rows
  renderAssetRow(row, rowInd) {
    return row.map((path, colInd) => (
      <div className="AssetBoard-square">
        <img
          className="AssetBoardImg"
          row={rowInd}
          col={colInd}
          src={require(`./assets/${path}`)}
          onClick={() => this.handleAssetSquareClick(path)}
        />
        {COMBINED_TILES[path].type === TILE_TYPE.HOLE ? (
          <div className="HoleLabel" onClick={() => this.handleAssetSquareClick(path)}>
            {COMBINED_TILES[path].label}
          </div>
        ) : null}
      </div>
    ));
  }

  // Helper to render asset board
  renderAssetBoard(assetBoard, categoryName) {
    return (
      <div className="AssetBoard-category">
        <h3>{categoryName}</h3>
        {assetBoard.map((val, ind) => (
          <div className="AssetBoard-row">{this.renderAssetRow(val, ind)}</div>
        ))}
      </div>
    );
  }

  // Helper to render selected asset
  renderSelectedAsset() {
    const { selectedAsset, selectedAssetFlipStatus, selectedAssetRotateStatus } = this.state;
    return (
      <img
        className="SelectedAssetImg"
        style={{
          transform: `scaleX(${selectedAssetFlipStatus}) rotate(${selectedAssetRotateStatus}deg)`,
        }}
        src={require(`./assets/${selectedAsset}`)}
      />
    );
  }

  flipAsset() {
    const { selectedAssetFlipStatus } = this.state;
    this.setState({ selectedAssetFlipStatus: -selectedAssetFlipStatus });
  }

  rotateAsset() {
    let { selectedAssetRotateStatus } = this.state;
    selectedAssetRotateStatus += 90 % 360; // Rotate 90 degrees clockwise
    this.setState({ selectedAssetRotateStatus });
  }

  handleFileNamechange(event) {
    this.setState({ fileName: event.target.value });
  }

  downloadFile() {
    const { fileName } = this.state;
    let download = document.getElementById('downloadFileLink');
    // Download json
    download.href = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(stateToJson(this.state))
    )}`;
    download.download = `${fileName || 'level'}.json`;
    download.click();
  }

  async loadFile() {
    const json = document.getElementById('loadJSON').files[0];
    // Check that file is selected
    if (!json) {
      alert('Choose a json file to load!');
      return;
    }
    // Continue
    const newBoards = this.initializeGameBoards(
      DEFAULT_SELECTED_ASSET,
      DEFAULT_SELECTED_ASSET_FLIP_STATUS,
      DEFAULT_SELECTED_ASSET_ROTATE_STATUS
    );
    const newLevel = await jsonToState(json, newBoards);
    if (newLevel) {
      this.setState({
        board: newLevel.board,
        flipAssetIndicator: newLevel.flipAssetIndicator,
        rotateAssetIndicator: newLevel.rotateAssetIndicator,
        largeAssetIndicator: newLevel.largeAssetIndicator,
      });
    }
  }

  render() {
    const {
      assetBoardBackground,
      assetBoardItem,
      assetBoardHome,
      assetBoardWall,
      assetBoardCharacter,
      fileName,
      eraseMode,
    } = this.state;
    return (
      <div className="App">
        <div className="Development">
          <div className="GameBoard">
            <h>GAMEBOARD</h>
            {this.renderGameBoard()}
            <div className="Files">
              <text>Export Level: </text>
              <input
                type="text"
                placeholder="Enter file name...(Default: level)"
                value={fileName}
                onChange={this.handleFileNamechange}
              />
              <button onClick={() => this.downloadFile()}>Save Level</button>
              <a id="downloadFileLink" />
              <br />
              <text style={{ color: 'gray' }}>OR</text>
              <br />
              <text>Import Level: </text>
              <input type="file" id="loadJSON" />
              <button onClick={() => this.loadFile()}>Load Level</button>
            </div>
          </div>
          <div className="Assets">
            <div className="AssetBoard">
              <h>ASSETBOARD</h>
              <div className="AssetScroller">
                {this.renderAssetBoard(assetBoardBackground, 'Background')}
                {this.renderAssetBoard(assetBoardItem, 'Item')}
                {this.renderAssetBoard(assetBoardHome, 'Home')}
                {this.renderAssetBoard(assetBoardCharacter, 'Character')}
                {this.renderAssetBoard(assetBoardWall, 'Environment')}
              </div>
            </div>

            <div className="SelectedAsset">
              <h>SELECTED ASSET</h>
              <br />
              {this.renderSelectedAsset()}
              <br />
              <Button outline color="info" type="button" onClick={() => this.flipAsset()}>
                Flip
              </Button>{' '}
              <Button outline color="primary" type="button" onClick={() => this.rotateAsset()}>
                Rotate
              </Button>{' '}
              <Button
                color={eraseMode ? 'warning' : 'outline-warning'}
                type="button"
                onClick={() => this.setState({ eraseMode: !eraseMode })}
              >
                Eraser
              </Button>
            </div>

            <div className="ResetButton">
              <Button outline color="danger" type="button" onClick={() => this.resetBoard()}>
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
