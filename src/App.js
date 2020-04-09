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
      boardRows: 14,
      boardCols: 20,
      board: [],
      selectedAsset: 'background/ground_64.png',
      selectedAssetIsBackground: true,
      assetBoardBackground: [],
      assetBoardItem: [],
      assetBoardHome: [],
      assetBoardWall: [],
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
    const newBoard = [];
    const assetList = Object.keys(assetDict);
    while (assetList.length !== 0) {
      newBoard.push(assetList.splice(0, assetBoardCol));
    }
    return newBoard;
  }

  // Clear entire game board
  resetBoard() {
    const { boardRows, boardCols, selectedAsset } = this.state;
    const newBoard = [];
    for (let i = 0; i < boardRows; i++) {
      let newRow = [];
      for (let j = 0; j < boardCols; j++) {
        newRow.push([selectedAsset]);
      }
      newBoard.push(newRow);
    }
    this.setState({ board: newBoard });
  }

  // Change selected square in game board to display selected asset
  handleGameSquareClick(rowInd, colInd) {
    let { board, selectedAsset, selectedAssetIsBackground } = this.state;
    if (selectedAssetIsBackground) {
      board[rowInd][colInd] = [selectedAsset];
    } else {
      if (board[rowInd][colInd].length !== 1) {
        board[rowInd][colInd].pop();
      }
      board[rowInd][colInd].push(selectedAsset);
    }
    this.setState({ board });
  }

  // Helper to render game board's individual rows
  renderGameRow(row, rowInd) {
    return row.map((path, colInd) => {
      if (path.length === 1) {
        return (
          <img
            className="GameBoard-square"
            row={rowInd}
            col={colInd}
            src={require(`./assets/${path[0]}`)}
            onClick={() => this.handleGameSquareClick(rowInd, colInd)}
          />
        );
      }
      return (
        <div className="GameBoard-square">
          <img
            className="image1"
            row={rowInd}
            col={colInd}
            src={require(`./assets/${path[0]}`)}
            onClick={() => this.handleGameSquareClick(rowInd, colInd)}
          />
          <img
            className="image2"
            row={rowInd}
            col={colInd}
            src={require(`./assets/${path[1]}`)}
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
    this.setState({ selectedAsset, selectedAssetIsBackground });
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

  render() {
    const {
      selectedAsset,
      assetBoardBackground,
      assetBoardItem,
      assetBoardHome,
      assetBoardWall,
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
              {this.renderAssetBoard(assetBoardWall, 'Wall')}
            </div>
          </div>

          <div className="SelectedAsset">
            <h>SELECTED ASSET</h>
            <br />
            <img className="SelectedAssetImg" src={require(`./assets/${selectedAsset}`)} />
          </div>

          <div className="ResetButton">
            <Button outline color="info" type="button" onClick={() => this.resetBoard()}>
              Reset
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
