/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
import React from 'react';
import './App.css';
import FloorEnum from './tiles';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardRows: 5,
      boardCols: 5,
      board: [],
      selectedAsset: FloorEnum.FLOOR2,
    };
  }

  // Initialize board on startup
  componentDidMount() {
    this.resetBoard();
  }

  // Clear entire game board
  resetBoard() {
    const { boardRows, boardCols } = this.state;
    const newBoard = [];
    for (let i = 0; i < boardRows; i++) {
      let newRow = [];
      for (let j = 0; j < boardCols; j++) {
        newRow.push(FloorEnum.FLOOR1);
      }
      newBoard.push(newRow);
    }
    this.setState({ board: newBoard });
  }

  handleGameSquareClick(rowInd, colInd) {
    let { board, selectedAsset } = this.state;
    board[rowInd][colInd] = selectedAsset;
    this.setState({ board });
  }

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

  render() {
    const { board } = this.state;
    return (
      <div className="App">
        <div className="GameBoard">
          {board.map((val, ind) => (
            <div className="GameBoard-row">{this.renderGameRow(val, ind)}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
