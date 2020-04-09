/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
import React from 'react';
import './App.css';
import TILES from './tiles';

const assetBoardCol = 3;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardRows: 5,
      boardCols: 5,
      board: [],
      selectedAsset: TILES[0],
      assetBoardBackground: [],
    };
  }

  // On startup
  componentDidMount() {
    // Initialize board
    this.resetBoard();

    // Initialize assets
    let assetBoardBackground = this.initializeAsset(TILES);
    this.setState({ assetBoardBackground });
  }

  initializeAsset(assetList) {
    const newBoard = [];
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
        newRow.push(selectedAsset);
      }
      newBoard.push(newRow);
    }
    this.setState({ board: newBoard });
  }

  // Change selected square in game board to display selected asset
  handleGameSquareClick(rowInd, colInd) {
    let { board, selectedAsset } = this.state;
    board[rowInd][colInd] = selectedAsset;
    this.setState({ board });
  }

  // Helper to render game board's individual rows
  renderGameRow(row, rowInd) {
    return row.map((path, colInd) => (
      <img
        className="GameBoard-Square"
        row={rowInd}
        col={colInd}
        src={require(`./assets/${path}`)}
        onClick={() => this.handleGameSquareClick(rowInd, colInd)}
      />
    ));
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
    let selectedAsset = assetList[rowInd][colInd];
    this.setState({ selectedAsset });
  }

  // Helper to render asset board's individual rows
  renderAssetRow(row, rowInd, assetList) {
    return row.map((path, colInd) => (
      <img
        className="AssetBoard-Square"
        row={rowInd}
        col={colInd}
        src={require(`./assets/${path}`)}
        onClick={() => this.handleAssetSquareClick(rowInd, colInd, assetList)}
      />
    ));
  }

  // Helper to render asset board
  renderAssetBoard(assetBoard) {
    return (
      <div className="AssetBoard-Category">
        {assetBoard.map((val, ind, assetList) => (
          <div className="AssetBoard-row">{this.renderAssetRow(val, ind, assetList)}</div>
        ))}
      </div>
    );
  }

  render() {
    const { selectedAsset, assetBoardBackground } = this.state;
    return (
      <div className="App">
        <h>GAMEBOARD</h>
        <div className="GameBoard">{this.renderGameBoard()}</div>

        <h>SELECTED ASSET</h>
        <div className="SelectedAsset">
          <img className="SelectedAsset" src={require(`./assets/${selectedAsset}`)} />
        </div>

        <h>ASSETBOARD</h>
        <div className="AssetBoard">{this.renderAssetBoard(assetBoardBackground)}</div>

        <button type="button" onClick={() => this.resetBoard()}>
          Reset
        </button>
      </div>
    );
  }
}

export default App;
