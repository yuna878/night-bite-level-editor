/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
import React from 'react';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { BACKGROUND_TILES, ITEM_TILES, HOME_TILES, WALL_TILES } from './tiles';

const assetBoardCol = 4;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardRows: 12,
      boardCols: 25,
      board: [],
      selectedAsset: 'background/ground_64.png',
      selectedAssetIsBackground: true,
      selectedAssetFlipStatus: 1, // 1: normal ; -1: flipped horizontally
      selectedAssetRotateStatus: 0, // Degrees
      assetBoardBackground: [],
      assetBoardItem: [],
      assetBoardHome: [],
      assetBoardWall: [],
      flipAssetIndicator: [],
      rotateAssetIndicator: [],
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
      newBoard.push(assetList.splice(0, assetBoardCol));
    }
    return newBoard;
  }

  // Clear entire game board
  resetBoard() {
    const { boardRows, boardCols, selectedAsset } = this.state;
    let board = [];
    let flipAssetIndicator = [];
    let rotateAssetIndicator = [];
    for (let i = 0; i < boardRows; i++) {
      let newRow = [];
      let newFlipRow = [];
      let newRotateRow = [];
      for (let j = 0; j < boardCols; j++) {
        newRow.push([selectedAsset]);
        newFlipRow.push([1]);
        newRotateRow.push([0]);
      }
      board.push(newRow);
      flipAssetIndicator.push(newFlipRow);
      rotateAssetIndicator.push(newRotateRow);
    }
    this.setState({ board, flipAssetIndicator, rotateAssetIndicator });
  }

  // Change selected square in game board to display selected asset
  handleGameSquareClick(rowInd, colInd) {
    let {
      board,
      selectedAsset,
      selectedAssetIsBackground,
      selectedAssetFlipStatus,
      selectedAssetRotateStatus,
      flipAssetIndicator,
      rotateAssetIndicator,
    } = this.state;
    if (selectedAssetIsBackground) {
      board[rowInd][colInd] = [selectedAsset];
      flipAssetIndicator[rowInd][colInd] = selectedAssetFlipStatus;
      rotateAssetIndicator[rowInd][colInd] = selectedAssetRotateStatus;
    } else {
      if (board[rowInd][colInd].length !== 1) {
        board[rowInd][colInd].pop();
        flipAssetIndicator[rowInd][colInd].pop();
        rotateAssetIndicator[rowInd][colInd].pop();
      }
      board[rowInd][colInd].push(selectedAsset);
      flipAssetIndicator[rowInd][colInd].push(selectedAssetFlipStatus);
      rotateAssetIndicator[rowInd][colInd].push(selectedAssetRotateStatus);
    }
    this.setState({ board, flipAssetIndicator, rotateAssetIndicator });
  }

  // Helper to render game board's individual rows
  renderGameRow(row, rowInd) {
    const { flipAssetIndicator, rotateAssetIndicator } = this.state;
    return row.map((path, colInd) => {
      // Background tile only
      if (path.length === 1) {
        return (
          <div className="GameBoard-square">
            <img
              row={rowInd}
              col={colInd}
              src={require(`./assets/${path[0]}`)}
              style={{
                transform: `scaleX(${flipAssetIndicator[rowInd][colInd][0]}) rotate(${rotateAssetIndicator[rowInd][colInd][0]})`,
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
  handleAssetSquareClick(rowInd, colInd, assetList) {
    let { assetBoardBackground, selectedAssetIsBackground } = this.state;
    let selectedAsset = assetList[rowInd][colInd];
    if (assetList === assetBoardBackground) {
      selectedAssetIsBackground = true;
    } else {
      selectedAssetIsBackground = false;
    }
    this.setState({
      selectedAsset,
      selectedAssetIsBackground,
      selectedAssetFlipStatus: 1,
      selectedAssetRotateStatus: 0,
    });
  }

  // Helper to render asset board's individual rows
  renderAssetRow(row, rowInd, assetList) {
    return row.map((path, colInd) => (
      <img
        className="AssetBoard-square"
        row={rowInd}
        col={colInd}
        src={require(`./assets/${path}`)}
        onClick={() => this.handleAssetSquareClick(rowInd, colInd, assetList)}
      />
    ));
  }

  // Helper to render asset board
  renderAssetBoard(assetBoard, categoryName) {
    return (
      <div className="AssetBoard-category">
        <h3>{categoryName}</h3>
        {assetBoard.map((val, ind, assetList) => (
          <div className="AssetBoard-row">{this.renderAssetRow(val, ind, assetList)}</div>
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
    const { assetBoardBackground, assetBoardItem, assetBoardHome, assetBoardWall } = this.state;
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
            </Button>{' '}
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
