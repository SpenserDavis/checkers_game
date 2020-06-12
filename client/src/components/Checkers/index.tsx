import React, { SyntheticEvent, ChangeEvent } from "react";
import "./board.css";
import Swal from "sweetalert2";
import Board from "./Board";
import { connect } from "react-redux";
import * as gameActions from "../../actions/game";
import * as shapeAndColorActions from "../../actions/shapesAndColors";
import * as piecePositionsActions from "../../actions/piecePositions";
import { StoreState } from "../../reducers";
import { ShapesAndColors } from "../../interfaces/shapesAndColors";

const SHAPES = ["circular", "triangular"];
const COLOR_SCHEMES = ["red-black", "orange-purple", "green-yellow"];

type CheckersProps = {
  getGameById: Function;
  errorOn: string;
  errorMessage: string;
  editSize: Function;
  editShape: Function;
  editColors: Function;
  pieceShape: string;
  pieceColorScheme: string;
  size: number;
};

type CheckersState = {
  boardResizerInput: string;
};

class Checkers extends React.Component<CheckersProps, CheckersState> {
  state = {
    boardResizerInput: "",
  };

  async componentDidMount(): Promise<void> {
    let gameId: string | null = localStorage.getItem("gameId");
    if (gameId !== null) {
      await this.props.getGameById(gameId);
      if (this.props.errorOn === "get") {
        Swal.fire({
          title: this.props.errorMessage,
          text: "Try again later.",
          icon: "error",
        });
      }
    }
  }

  handleBoardSizeInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    let { value } = e.target;

    //ensures that only numbers are entered
    const reg: RegExp = /^\d+$/;
    if (!reg.test(value)) {
      return;
    }
    let numericalValue: number = parseInt(value);
    if (numericalValue < 5) {
      Swal.fire({
        title: "Board is too small!",
        text: "Please enter a value > 5",
        icon: "error",
      });
      return;
    }
    this.setState(
      {
        boardResizerInput: value,
      },
      () => this.props.editSize(numericalValue)
    );
  };

  //detects backspaces to adjust input
  onKeyDown = (e: React.KeyboardEvent): void => {
    if (e.keyCode !== 8) {
      return;
    }
    let { boardResizerInput }: { boardResizerInput: string } = this.state;
    if (boardResizerInput === "") {
      return;
    }
    let newInputText: string = boardResizerInput
      .toString()
      .slice(0, boardResizerInput.length - 1);
    this.setState({
      boardResizerInput: newInputText,
    });
  };

  handleShapeOrColorChange = (e: SyntheticEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    name === "pieceShape"
      ? this.props.editShape(value)
      : this.props.editColors(value);
  };

  renderShapesInput = (): React.ReactElement<any> => {
    return (
      <div className="row shapesInput">
        <form>
          Piece Shape
          {SHAPES.map((shape, i) => (
            <div key={`shape-${i}`} className="col">
              <input
                name="pieceShape"
                type="radio"
                value={shape}
                checked={this.props.pieceShape === shape}
                onChange={this.handleShapeOrColorChange}
              />
              {shape}
            </div>
          ))}
        </form>
      </div>
    );
  };

  renderColorsInput = (): React.ReactElement<any> => {
    return (
      <div className="row colorsInput">
        <form>
          Piece Color Scheme
          {COLOR_SCHEMES.map((scheme: string, i: number) => (
            <div key={`color-scheme-${i}`} className="col">
              <input
                name="pieceColorScheme"
                type="radio"
                value={scheme}
                checked={this.props.pieceColorScheme === scheme}
                onChange={this.handleShapeOrColorChange}
              />
              {scheme.split("-").join("/")}
            </div>
          ))}
        </form>
      </div>
    );
  };

  renderBoardResizerInputField = (): React.ReactElement<any> => {
    return (
      <input
        className="board-resizer-input"
        name="boardResizerInput"
        onChange={this.handleBoardSizeInputChange}
        onKeyDown={this.onKeyDown}
        placeholder="Please enter a board size..."
        value={this.state.boardResizerInput}
      ></input>
    );
  };

  render() {
    const { pieceShape, pieceColorScheme, size }: CheckersProps = this.props;
    const boardProps: ShapesAndColors = { pieceShape, pieceColorScheme };
    return (
      <>
        <div className="row d-flex justify-content-center">
          {this.renderBoardResizerInputField()}
        </div>
        <div className="d-flex justify-content-center">
          {this.renderColorsInput()}
          {this.renderShapesInput()}
        </div>
        {size > 0 && <Board {...boardProps} />}
      </>
    );
  }
}

const mapStateToProps = ({ shapesAndColors, game }: StoreState) => {
  const { pieceColorScheme, pieceShape } = shapesAndColors;
  const { piecePositions, size, error } = game;
  const { errorOn, errorMessage } = error;
  return {
    piecePositions,
    pieceColorScheme,
    pieceShape,
    size,
    errorOn,
    errorMessage,
  };
};

const actions = {
  ...gameActions,
  ...shapeAndColorActions,
  ...piecePositionsActions,
};

export default connect(mapStateToProps, actions)(Checkers as any);
