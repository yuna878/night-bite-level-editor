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
  COMBINED_TILES,
  TILE_TYPE,
} from './tiles';

const ASSETBOARD_COLS = 4;
const GAMESQUARE_SIZE = 50;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardRows: 12,
      boardCols: 25,
      board: [], // 2d array where each element is an array strings of path to asset
      selectedAsset: 'background/ground_64.png',
      selectedAssetIsBackground: true,
      selectedAssetFlipStatus: 1, // 1: normal ; -1: flipped horizontally
      selectedAssetRotateStatus: 0, // Degrees
      selectedAssetSizeRatio: 1,
      assetBoardBackground: [],
      assetBoardItem: [],
      assetBoardHome: [],
      assetBoardWall: [],
      flipAssetIndicator: [], // 2d array where each element is an array of ints indicating flip status
      rotateAssetIndicator: [], // 2d array where each element is array of ints indicating degree of rotation
      largeAssetIndicator: [], // 2d array where each element is null or [size, x_coord, y_coord] for top-most image
    };
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
    this.setState({
      assetBoardBackground,
      assetBoardItem,
      assetBoardHome,
      assetBoardWall,
    });
  }

  initializeAsset(assetDict) {
    let newBoard = [];
    const assetList = Object.keys(assetDict);
    while (assetList.length !== 0) {
      newBoard.push(assetList.splice(0, ASSETBOARD_COLS));
    }
    return newBoard;
  }

  // Clear entire game board
  resetBoard() {
    const {
      boardRows,
      boardCols,
      selectedAsset,
      selectedAssetFlipStatus,
      selectedAssetRotateStatus,
    } = this.state;
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
        newRow.push([selectedAsset]);
        newFlipRow.push([selectedAssetFlipStatus]);
        newRotateRow.push([selectedAssetRotateStatus]);
        newLargeRow.push(null);
      }
      board.push(newRow);
      flipAssetIndicator.push(newFlipRow);
      rotateAssetIndicator.push(newRotateRow);
      largeAssetIndicator.push(newLargeRow);
    }
    this.setState({
      board,
      flipAssetIndicator,
      rotateAssetIndicator,
      largeAssetIndicator,
    });
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
    } = this.state;

    for (let i = 0; i < selectedAssetSizeRatio; i++) {
      for (let j = 0; j < selectedAssetSizeRatio; j++) {
        let x = rowInd + i;
        let y = colInd + j;
        if (x < boardRows && y < boardCols) {
          largeAssetIndicator[x][y] = [selectedAssetSizeRatio, i, j];
          if (selectedAssetIsBackground) {
            board[x][y] = [selectedAsset];
            flipAssetIndicator[x][y] = [selectedAssetFlipStatus];
            rotateAssetIndicator[x][y] = [selectedAssetRotateStatus];
          } else {
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
      const largeAsset = largeAssetIndicator[rowInd][colInd]
        ? largeAssetIndicator[rowInd][colInd]
        : false;
      const largeAssetSize = largeAsset[0] * GAMESQUARE_SIZE;

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
          <div className="HoleText">{COMBINED_TILES[path].label}</div>
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

  render() {
    const {
      assetBoardBackground, assetBoardItem, assetBoardHome, assetBoardWall,
    } = this.state;
    return (
      <div className="App">
        <div className="GameBoard">
          <h>GAMEBOARD</h>
          {this.renderGameBoard()}
        </div>
        <div className="Assets">
          <div className="AssetBoard">
            <h>ASSETBOARD</h>
            <div className="AssetScroller">
              {this.renderAssetBoard(assetBoardBackground, 'Background')}
              {this.renderAssetBoard(assetBoardItem, 'Item')}
              {this.renderAssetBoard(assetBoardHome, 'Home')}
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
            </Button>
            {' '}
            <Button outline color="primary" type="button" onClick={() => this.rotateAsset()}>
              Rotate
            </Button>
          </div>

          <div className="ResetButton">
            <Button outline color="danger" type="button" onClick={() => this.resetBoard()}>
              Reset
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
