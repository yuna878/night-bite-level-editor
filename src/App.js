/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
import React from 'react';
import { Button } from 'reactstrap';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { HotKeys } from 'react-hotkeys';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import {
  GROUND_TILES,
  BRICK_TILES,
  HOLE_BACKGROUND_TILES,
  HOLE_EDGE_TILES,
  CHARACTER_TILES,
  ENEMY_TILES,
  HOME_TILES,
  ENVIRONMENT_TILES,
  ITEM_TILES,
  TILE_TYPE,
  COMBINED_TILES,
} from './tiles';
import { stateToJson, jsonToState, assetToJson } from './jsonParsing';

const ASSETBOARD_COLS = 4;
const GAMESQUARE_SIZE = 50; // From CSS .GameBoard-square size (in px)
const DEFAULT_SELECTED_ASSET = 'background/blue/Blue_Texture.png';
const DEFAULT_SELECTED_ASSET_IS_BACKGROUND = true;
const DEFAULT_SELECTED_ASSET_IS_DECORATION = false;
const DEFAULT_SELECTED_ASSET_FLIP_STATUS = 1;
const DEFAULT_SELECTED_ASSET_ROTATE_STATUS = 0;
const DEFAULT_SELECTED_ASSET_SIZE_RATIO = 1;

const hotKeyMap = {
  HOTKEY_ROTATE: 'r',
  HOTKEY_ERASE: 'e',
  HOTKEY_FLIP: 'f',
  HOTKEY_LIGHT: 't',
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardRows: 12,
      boardCols: 20,
      /** BOARD: 2d array of { background, decoration, object }
       *  Each element maps to null or { texture, flip, rotate }
       *  texture : string of path to texture
       *  flip : int indicating flip status (1: normal ; -1: flipped horizontally)
       *  rotate : ints indicating degree of rotation */
      board: [],
      largeAssetIndicator: [], // 2d array where each element is null or [width, height, x_coord relative to image, y_coord relative to image] (only applies for 'object' asset)
      lightIndicator: [], // 2d array where each element is a boolean indicating whether top-most asset needs a light source (for large asset, only indicated for top-left position)
      selectedAsset: DEFAULT_SELECTED_ASSET,
      selectedAssetIsBackground: DEFAULT_SELECTED_ASSET_IS_BACKGROUND,
      selectedAssetIsDecoration: DEFAULT_SELECTED_ASSET_IS_DECORATION,
      selectedAssetFlipStatus: DEFAULT_SELECTED_ASSET_FLIP_STATUS, // 1: normal ; -1: flipped horizontally
      selectedAssetRotateStatus: DEFAULT_SELECTED_ASSET_ROTATE_STATUS, // Degrees
      selectedAssetSizeWidth: DEFAULT_SELECTED_ASSET_SIZE_RATIO,
      selectedAssetSizeHeight: DEFAULT_SELECTED_ASSET_SIZE_RATIO,
      assetBoardGround: [],
      assetBoardBrick: [],
      assetBoardHoleBackground: [],
      assetBoardHoleEdge: [],
      assetBoardCharacter: [],
      assetBoardEnemy: [],
      assetBoardHome: [],
      assetBoardEnvironment: [],
      assetBoardItem: [],
      fileName: null, // file name for saving level json
      eraseMode: false,
      lightMode: false,
      selectedPalette: 'All', // selected color palette for assets
    };

    this.handleFileNamechange = this.handleFileNamechange.bind(this);
  }

  /****************************************************************
   ************************ INITIALIZATION ************************
   ****************************************************************/

  componentDidMount() {
    // Initialize board
    this.resetBoard();
    // Initialize assets
    let assetBoardGround = this.initializeAsset(GROUND_TILES);
    let assetBoardBrick = this.initializeAsset(BRICK_TILES);
    let assetBoardHoleBackground = this.initializeAsset(HOLE_BACKGROUND_TILES);
    let assetBoardHoleEdge = this.initializeAsset(HOLE_EDGE_TILES);
    let assetBoardCharacter = this.initializeAsset(CHARACTER_TILES);
    let assetBoardEnemy = this.initializeAsset(ENEMY_TILES);
    let assetBoardHome = this.initializeAsset(HOME_TILES);
    let assetBoardEnvironment = this.initializeAsset(ENVIRONMENT_TILES);
    let assetBoardItem = this.initializeAsset(ITEM_TILES);
    this.setState({
      assetBoardGround,
      assetBoardBrick,
      assetBoardHoleBackground,
      assetBoardHoleEdge,
      assetBoardCharacter,
      assetBoardEnemy,
      assetBoardHome,
      assetBoardEnvironment,
      assetBoardItem,
    });
  }

  // Initialize a list of assets for a category
  initializeAsset(assetDict) {
    return Object.keys(assetDict);
  }

  // Initialize all asset boards with given values
  initializeGameBoards(asset, assetFlipStatus, assetRotateStatus) {
    const { boardRows, boardCols } = this.state;
    const background = {
      texture: asset,
      flip: assetFlipStatus,
      rotate: assetRotateStatus,
    };

    let board = [];
    let largeAssetIndicator = [];
    let lightIndicator = [];
    for (let i = 0; i < boardRows; i++) {
      let newRow = [];
      let newLargeRow = [];
      let newLightRow = [];
      for (let j = 0; j < boardCols; j++) {
        newRow.push({ background, decoration: null, object: null });
        newLargeRow.push(null);
        newLightRow.push(false);
      }
      board.push(newRow);
      largeAssetIndicator.push(newLargeRow);
      lightIndicator.push(newLightRow);
    }
    return {
      board,
      largeAssetIndicator,
      lightIndicator,
    };
  }

  /****************************************************************
   ************************ GAME BOARD ****************************
   ****************************************************************/

  // Change selected square in game board to display selected asset
  handleGameSquareClick(rowInd, colInd) {
    let {
      board,
      boardRows,
      boardCols,
      selectedAsset,
      selectedAssetIsBackground,
      selectedAssetIsDecoration,
      selectedAssetFlipStatus,
      selectedAssetRotateStatus,
      selectedAssetSizeWidth,
      selectedAssetSizeHeight,
      largeAssetIndicator,
      lightIndicator,
      eraseMode,
      lightMode,
    } = this.state;

    let tileInfo = board[rowInd][colInd];

    if (eraseMode) {
      /************** ERASER MODE **************/
      // Erase top-most layer of asset; Don't erase background
      if (tileInfo.object) {
        tileInfo.object = null;
      } else if (tileInfo.decoration) {
        tileInfo.decoration = null;
      }
      // Erase light source if only background is left
      if (!tileInfo.object && !tileInfo.decoration) {
        lightIndicator[rowInd][colInd] = false;
      }
    } else if (lightMode) {
      /************** LIGHT MODE **************/
      // Add light if square has an overlay asset (need to attach light source to an object)
      if (tileInfo.object) {
        // If square is part of large asset, change light indicator for top-left corner of asset
        const largeAsset = largeAssetIndicator[rowInd][colInd];
        if (largeAsset) {
          rowInd = rowInd - largeAsset[2];
          colInd = colInd - largeAsset[3];
        }
        lightIndicator[rowInd][colInd] = !lightIndicator[rowInd][colInd];
      } else if (tileInfo.decoration) {
        lightIndicator[rowInd][colInd] = !lightIndicator[rowInd][colInd];
      }
    } else {
      /************** DRAWING MODE **************/
      const updateInfo = {
        texture: selectedAsset,
        flip: selectedAssetFlipStatus,
        rotate: selectedAssetRotateStatus,
      };

      // Update board depending on selected asset type
      if (selectedAssetIsBackground) {
        /*********** Background ***********/
        board[rowInd][colInd].background = updateInfo;
      } else if (selectedAssetIsDecoration) {
        /*********** Decoration ***********/
        board[rowInd][colInd].decoration = updateInfo;
      } else {
        /*********** Overlay ***********/
        // Mainly for large assets -> Go through all coordinates that is covered by the asset
        for (let i = 0; i < selectedAssetSizeHeight; i++) {
          for (let j = 0; j < selectedAssetSizeWidth; j++) {
            let x = rowInd + i;
            let y = colInd + j;
            // Check new coordinate is in bounds of board
            if (x < boardRows && y < boardCols) {
              board[x][y].object = updateInfo;
              largeAssetIndicator[x][y] = [selectedAssetSizeWidth, selectedAssetSizeHeight, i, j];
            }
          }
        }
      }
    }
    this.setState({
      board,
      largeAssetIndicator,
      lightIndicator,
    });
  }

  // Helper to correctly render&position large assets
  generateMargin(assetInfo) {
    const x = assetInfo[2];
    const y = assetInfo[3];
    return `${-GAMESQUARE_SIZE * x}px 0px 0px ${-GAMESQUARE_SIZE * y}px`;
  }

  // Helper to render game board's individual rows
  renderGameRow(row, rowInd) {
    const {
      flipAssetIndicator,
      rotateAssetIndicator,
      largeAssetIndicator,
      lightIndicator,
    } = this.state;

    return row.map((tileInfo, colInd) => {
      const { background, decoration, object } = tileInfo;
      const largeAsset = largeAssetIndicator[rowInd][colInd];
      const hasLight = lightIndicator[rowInd][colInd];

      return (
        <div className="GameBoard-square">
          <img
            row={rowInd}
            col={colInd}
            src={require(`./assets/${background.texture}`)}
            style={{
              transform: `scaleX(${background.flip}) rotate(${background.rotate}deg)`,
            }}
            onClick={() => this.handleGameSquareClick(rowInd, colInd)}
          />
          {decoration ? (
            <img
              row={rowInd}
              col={colInd}
              src={require(`./assets/${decoration.texture}`)}
              style={{
                transform: `scaleX(${decoration.flip}) rotate(${decoration.rotate}deg)`,
              }}
              onClick={() => this.handleGameSquareClick(rowInd, colInd)}
            />
          ) : null}
          {object ? (
            <img
              row={rowInd}
              col={colInd}
              src={require(`./assets/${object.texture}`)}
              style={{
                transform: `scaleX(${object.flip}) rotate(${object.rotate}deg)`,
                width: `${largeAsset ? largeAsset[0] * GAMESQUARE_SIZE : null}px`,
                height: `${largeAsset ? largeAsset[1] * GAMESQUARE_SIZE : null}px`,
                margin: `${largeAsset ? this.generateMargin(largeAsset) : null}`,
              }}
              onClick={() => this.handleGameSquareClick(rowInd, colInd)}
            />
          ) : null}
          {hasLight ? (
            <img
              className="LightSource"
              row={rowInd}
              col={colInd}
              src={require(`./assets/light_64.png`)}
              onClick={() => this.handleGameSquareClick(rowInd, colInd)}
            />
          ) : null}
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

  /****************************************************************
   ************************ ASSET BOARD ***************************
   ****************************************************************/

  // Change selected asset
  handleAssetSquareClick(path) {
    let selectedAssetIsBackground = COMBINED_TILES[path].type === TILE_TYPE.GROUND;
    let selectedAssetIsDecoration = COMBINED_TILES[path].type === TILE_TYPE.DECORATION;
    this.setState({
      selectedAsset: path,
      selectedAssetIsBackground,
      selectedAssetIsDecoration,
      selectedAssetFlipStatus: 1,
      selectedAssetRotateStatus: 0,
      selectedAssetSizeWidth: COMBINED_TILES[path].width,
      selectedAssetSizeHeight: COMBINED_TILES[path].height,
      eraseMode: false,
      lightMode: false,
    });
  }

  // Helper to render asset board
  renderAssetBoard(assetBoard, categoryName) {
    const { selectedPalette } = this.state;
    // Filter assets for selected palette
    if (selectedPalette !== 'All') {
      assetBoard = assetBoard.filter((path) =>
        COMBINED_TILES[path].palette ? COMBINED_TILES[path].palette === selectedPalette : true
      );
    }
    return (
      <div className="AssetBoard-category">
        <h3>{categoryName}</h3>
        <div className="AssetBoard-category-images">
          {assetBoard.map((path, ind) => (
            <div className="AssetBoard-square">
              <img
                className="AssetBoardImg"
                ind={ind}
                src={require(`./assets/${path}`)}
                onClick={() => this.handleAssetSquareClick(path)}
              />
              {/* Handle labels */}
              {COMBINED_TILES[path].label ? (
                <div
                  id={COMBINED_TILES[path].type === TILE_TYPE.GROUND ? 'light' : null}
                  className="Label"
                  onClick={() => this.handleAssetSquareClick(path)}
                >
                  {COMBINED_TILES[path].label}
                </div>
              ) : null}
            </div>
          ))}
        </div>
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

  /****************************************************************
   ************************ HANDLER FUNCTIONS *********************
   ****************************************************************/

  resetBoard() {
    const { selectedAsset, selectedAssetFlipStatus, selectedAssetRotateStatus } = this.state;
    this.setState({ lightMode: false, eraseMode: false });
    this.setState(
      this.initializeGameBoards(selectedAsset, selectedAssetFlipStatus, selectedAssetRotateStatus)
    );
  }

  flipAsset() {
    const { selectedAssetFlipStatus } = this.state;
    this.setState({ selectedAssetFlipStatus: -selectedAssetFlipStatus });
  }

  rotateAsset() {
    let { selectedAssetRotateStatus } = this.state;
    selectedAssetRotateStatus = (selectedAssetRotateStatus + 90) % 360; // Rotate 90 degrees clockwise
    this.setState({ selectedAssetRotateStatus });
  }

  changeAssetPalette(selectedPalette) {
    this.setState({ selectedPalette });
  }

  // Input field for download file name
  handleFileNamechange(event) {
    this.setState({ fileName: event.target.value });
  }

  hotKeyHandlers = {
    HOTKEY_ROTATE: () => this.rotateAsset(),
    HOTKEY_ERASE: () => this.setState({ eraseMode: !this.state.eraseMode, lightMode: false }),
    HOTKEY_FLIP: () => this.flipAsset(),
    HOTKEY_LIGHT: () => this.setState({ lightMode: !this.state.lightMode, eraseMode: false }),
  };

  /****************************************************************
   ***************************** JSON *****************************
   ****************************************************************/
  downloadLevelJson() {
    const { fileName } = this.state;
    let download = document.getElementById('downloadLevelJsonLink');
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
        largeAssetIndicator: newLevel.largeAssetIndicator,
        lightIndicator: newLevel.lightIndicator,
      });
    }
  }

  downloadAssetJson() {
    let download = document.getElementById('downloadAssetJsonLink');
    // Download json
    download.href = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(assetToJson())
    )}`;
    download.download = `assets.json`;
    download.click();
  }

  /****************************************************************
   ***************************** RENDER ***************************
   ****************************************************************/

  render() {
    const {
      assetBoardGround,
      assetBoardBrick,
      assetBoardHoleBackground,
      assetBoardHoleEdge,
      assetBoardCharacter,
      assetBoardEnemy,
      assetBoardHome,
      assetBoardEnvironment,
      assetBoardItem,
      fileName,
      eraseMode,
      lightMode,
    } = this.state;

    return (
      <div className="App">
        <HotKeys keyMap={hotKeyMap} handlers={this.hotKeyHandlers}>
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
                <button onClick={() => this.downloadLevelJson()}>Save Level</button>
                <a id="downloadLevelJsonLink" />
                <br />
                <text style={{ color: 'gray' }}>OR</text>
                <br />
                <text>Import Level: </text>
                <input type="file" id="loadJSON" />
                <button onClick={() => this.loadFile()}>Load Level</button>
                <br />
                <text style={{ color: 'gray' }}>OR</text>
                <br />
                <text>Download Assets JSON: </text>
                <button onClick={() => this.downloadAssetJson()}>Download</button>
                <a id="downloadAssetJsonLink" />
              </div>
            </div>
            <div className="Assets">
              <div className="AssetBoard">
                <h>ASSETBOARD</h>
                <br />
                <ToggleButtonGroup
                  type="radio"
                  name="options"
                  defaultValue={'All'}
                  onChange={(val) => this.changeAssetPalette(val)}
                >
                  <ToggleButton value={'All'}>All</ToggleButton>
                  <ToggleButton value={'Blue'}>Blue</ToggleButton>
                  <ToggleButton value={'Purple'}>Purple</ToggleButton>
                  <ToggleButton value={'Red'}>Red</ToggleButton>
                </ToggleButtonGroup>
                <div className="AssetScroller">
                  {this.renderAssetBoard(assetBoardGround, 'Ground')}
                  {this.renderAssetBoard(assetBoardBrick, 'Brick')}
                  {this.renderAssetBoard(assetBoardHoleBackground, 'Hole Background')}
                  {this.renderAssetBoard(assetBoardHoleEdge, 'Hole Edge')}
                  {this.renderAssetBoard(assetBoardItem, 'Item')}
                  {this.renderAssetBoard(assetBoardCharacter, 'Character')}
                  {this.renderAssetBoard(assetBoardHome, 'Home')}
                  {this.renderAssetBoard(assetBoardEnemy, 'Enemy')}
                  {this.renderAssetBoard(assetBoardEnvironment, 'Environment')}
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
                <Button
                  color={eraseMode ? 'warning' : 'outline-warning'}
                  type="button"
                  onClick={() => this.setState({ eraseMode: !eraseMode, lightMode: false })}
                >
                  Eraser
                </Button>
                <br />
                <Button outline color="primary" type="button" onClick={() => this.rotateAsset()}>
                  Rotate
                </Button>{' '}
                <Button
                  color={lightMode ? 'success' : 'outline-success'}
                  type="button"
                  onClick={() => this.setState({ lightMode: !lightMode, eraseMode: false })}
                >
                  Light
                </Button>
              </div>
              <div className="ResetButton">
                <Button outline color="danger" type="button" onClick={() => this.resetBoard()}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </HotKeys>{' '}
      </div>
    );
  }
}

export default App;
