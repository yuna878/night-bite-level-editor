import React from 'react';
import './App.css';
import { FloorEnum } from './tiles';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardRows: 5,
      boardCols: 5,
    };
  }

  // Initialize board on startup
  componentWillMount() {
    this.resetBoard();
  }

  // Clear entire board
  resetBoard() {
    const { boardRows, boardCols } = this.state;
    const newBoard = Array(boardRows).fill(Array(boardCols).fill(FloorEnum.FLOOR1));
    this.setState({
      board: newBoard,
    });
  }

  render() {
    return (
      <div className="App">
        <p>YAY</p>
      </div>
    );
  }
}

export default App;
