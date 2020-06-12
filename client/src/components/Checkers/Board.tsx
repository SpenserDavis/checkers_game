import React from "react";
import "./board.css";
import Square from "./Square";
import { connect } from "react-redux";
import * as gameActions from "../../actions/game";
import * as piecePositionsActions from "../../actions/piecePositions";
import Swal from "sweetalert2";
import { Pieces, SavedGameState } from "../../interfaces/game";
import { StoreState } from "../../reducers";

type BoardProps = {
  playerTurn: number;
  pieceColorScheme: string;
  pieceShape: string;
  playerHasPiecesRemaining: boolean[];
  currentlySelectedPiecePosition: number[];
  movePiece: Function;
  piecePositions: Pieces[][];
  resetPositions: Function;
  deleteGame: Function;
  saveGame: Function;
  size: number;
  toggleTurn: Function;
  errorMessage: string;
  errorOn: string;
};

interface EligibleDestinationSquares {
  [coordinates: string]: MovementInfo;
}

export interface MovementInfo {
  destination: number[];
  movementIncludesPromotion: boolean;
  skippedSquares: {};
}

const Board = ({
  playerTurn,
  pieceColorScheme,
  pieceShape,
  playerHasPiecesRemaining,
  currentlySelectedPiecePosition,
  movePiece,
  piecePositions,
  resetPositions,
  deleteGame,
  saveGame,
  size,
  toggleTurn,
  errorMessage,
  errorOn,
}: BoardProps) => {
  const { empty, p1, p2, p1King, p2King } = Pieces;

  const squareContainsOpposingPlayer = (
    currPlayer: number,
    destination: Pieces
  ): boolean => {
    return currPlayer === p1
      ? destination === p2 || destination === p2King
      : destination === p1 || destination === p1King;
  };

  const destinationIsOutsideBoardBounds = (
    i: number,
    j: number,
    n: number
  ): boolean => {
    return i < 0 || i > n - 1 || j < 0 || j > n - 1;
  };

  const moveIsIllegal = (
    player: number,
    pieceIsKing: boolean,
    startX: number,
    destinationX: number
  ): boolean => {
    if (pieceIsKing) {
      return false;
    }

    return player === 1 ? destinationX < startX : destinationX > startX;
  };

  const skipDestinationIsEmptySquare = (
    i: number,
    j: number,
    n: number,
    piecePositions: Pieces[][]
  ): boolean => {
    if (destinationIsOutsideBoardBounds(i, j, n)) {
      return false;
    }

    return piecePositions[i][j] === empty;
  };

  const checkCorner = (
    player: number,
    startSquare: number[],
    destinationSquare: number[],
    piecePositions: Pieces[][],
    n: number,
    pieceIsKing: boolean,
    shift: number[],
    eligibleDestinationSquares: EligibleDestinationSquares,
    comingFromSkip: boolean,
    prevSquare: number[]
  ) => {
    const [destinationX, destinationY]: number[] = destinationSquare;

    if (destinationIsOutsideBoardBounds(destinationX, destinationY, n)) {
      return;
    }
    const [startX, startY]: number[] = startSquare;
    const [prevX, prevY]: number[] = prevSquare;

    if (moveIsIllegal(player, pieceIsKing, startX, destinationX)) {
      return;
    }

    let destination: Pieces = piecePositions[destinationX][destinationY];
    if (!pieceIsKing) {
      pieceIsKing = player === 1 ? destinationX === n - 1 : destinationX === 0;
    }
    if (destination === 0 && !comingFromSkip) {
      eligibleDestinationSquares[`${destinationX}-${destinationY}`] = {
        destination: [destinationX, destinationY],
        movementIncludesPromotion: pieceIsKing,
        skippedSquares: {},
      };
    } else if (squareContainsOpposingPlayer(player, destination)) {
      const [shiftX, shiftY]: number[] = shift;
      const skipDestinationX: number = destinationX + shiftX;
      const skipDestinationY: number = destinationY + shiftY;
      if (prevX === skipDestinationX && prevY === skipDestinationY) {
        return;
      }
      if (
        skipDestinationIsEmptySquare(
          skipDestinationX,
          skipDestinationY,
          n,
          piecePositions
        )
      ) {
        if (!pieceIsKing) {
          pieceIsKing =
            player === 1 ? skipDestinationX === n - 1 : skipDestinationX === 0;
        }

        let prevSkippedSquares = {};
        const prevSquare: string = `${startX}-${startY}`;
        if (prevSquare in eligibleDestinationSquares) {
          prevSkippedSquares =
            eligibleDestinationSquares[prevSquare].skippedSquares;
        }

        eligibleDestinationSquares[
          `${skipDestinationX}-${skipDestinationY}`
        ] = {
          destination: [skipDestinationX, skipDestinationY],
          movementIncludesPromotion: pieceIsKing,
          skippedSquares: {
            ...prevSkippedSquares,
            [`${destinationX}-${destinationY}`]: true,
          },
        };

        getPossibleMovesHelper(
          player,
          skipDestinationX,
          skipDestinationY,
          piecePositions,
          n,
          pieceIsKing,
          eligibleDestinationSquares,
          true,
          [startX, startY]
        );
      }
    }
  };

  const getPossibleMovesHelper = (
    player: number,
    i: number,
    j: number,
    piecePositions: Pieces[][],
    n: number,
    pieceIsKing: boolean,
    eligibleDestinationSquares: EligibleDestinationSquares,
    comingFromSkip: boolean = false,
    prev: number[] = [-Infinity, Infinity]
  ) => {
    let movements: number[][] = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    for (let movement of movements) {
      const [xShift, yShift]: number[] = movement;
      checkCorner(
        player,
        [i, j],
        [i + xShift, j + yShift],
        piecePositions,
        n,
        pieceIsKing,
        movement,
        eligibleDestinationSquares,
        comingFromSkip,
        prev
      );
    }
  };

  const getPossibleMoves = (
    player: number,
    i: number,
    j: number,
    piecePositions: Pieces[][],
    n: number,
    pieceIsKing: boolean
  ) => {
    const eligibleDestinationSquares: EligibleDestinationSquares = {};

    getPossibleMovesHelper(
      player,
      i,
      j,
      piecePositions,
      n,
      pieceIsKing,
      eligibleDestinationSquares
    );

    return eligibleDestinationSquares;
  };

  const tryMoveSelectedPiece = ({
    destination,
    movementIncludesPromotion,
    skippedSquares,
  }: MovementInfo) => {
    movePiece(
      currentlySelectedPiecePosition,
      destination,
      movementIncludesPromotion,
      skippedSquares
    );
  };

  const resetGame = async (): Promise<void> => {
    resetPositions();
    const gameId: string | null = localStorage.getItem("gameId");
    if (gameId !== null) {
      await deleteGame(gameId);
      //ideally, this would be wrapped in a try-catch loop, but for user experience, we want to delete
      //the item from local storage anyway
      localStorage.removeItem("gameId");
    }
  };

  const handleSaveGameRequest = async (): Promise<void> => {
    const data: SavedGameState = {
      piecePositions,
      playerTurn,
      size,
      playerHasPiecesRemaining,
      pieceShape,
      pieceColorScheme,
    };

    const oldGameId: string | null = localStorage.getItem("gameId");
    await saveGame(data);
    if (errorOn === "save") {
      Swal.fire({
        title: errorMessage,
        text: "Try again later.",
        icon: "error",
      });
    } else {
      //remove old game
      if (oldGameId !== null) {
        deleteGame(oldGameId);
      }
      //i made the decision to save and delete rather than edit/put for 2 reasons:
      //1) moves are not being saved immediately,
      //2) interview time constraints
    }
  };

  const endGame = (
    playerHasPiecesRemaining: boolean[],
    color1: string,
    color2: string
  ): void => {
    console.log("ending game");
    const winner: number = playerHasPiecesRemaining[0] ? 1 : 2;

    let winningColor: string = winner === 1 ? color1 : color2;
    winningColor = winningColor
      .split("")
      .map((c, i) => (i === 0 ? c.toUpperCase() : c))
      .join("");

    Swal.fire({
      title: `${winningColor} wins!`,
      icon: "info",
    });
  };

  const handleTurnPass = (): void => {
    toggleTurn();
  };

  const renderBoard = () => {
    const [x, y]: number[] = currentlySelectedPiecePosition;
    const [color1, color2]: string[] = pieceColorScheme.split("-");
    let eligibleDestinationSquares: EligibleDestinationSquares = {};
    if (x !== undefined) {
      const piece: Pieces = piecePositions[x][y];
      const pieceIsKing: boolean = piece === p1King || piece === p2King;
      const currPlayer: number = piece === p1 || piece === p1King ? 1 : 2;

      eligibleDestinationSquares = getPossibleMoves(
        currPlayer,
        x,
        y,
        piecePositions,
        size,
        pieceIsKing
      );
    }

    return piecePositions.map((row: Pieces[], i: number) => (
      <div key={`board-row-${i}`} className="row">
        {row.map((piece: Pieces, j: number) => (
          <Square
            tryMoveSelectedPiece={tryMoveSelectedPiece}
            eligibleDestination={
              `${i}-${j}` in eligibleDestinationSquares
                ? eligibleDestinationSquares[`${i}-${j}`]
                : null
            }
            playerTurn={playerTurn}
            key={`board-piece-${i}-${j}`}
            position={[i, j]}
            piece={piece}
            color={piece === p1 || piece === p1King ? color1 : color2}
            pieceShape={pieceShape}
          />
        ))}
      </div>
    ));
  };

  const gameIsOver: boolean =
    !playerHasPiecesRemaining[0] || !playerHasPiecesRemaining[1];

  const renderTurnOrGameOverNote = (): React.ReactElement<any> | void => {
    const [color1, color2]: string[] = pieceColorScheme.split("-");
    if (!gameIsOver) {
      const turn: string = playerTurn === 1 ? color1 : color2;
      const turnColor: string = turn
        .split("")
        .map((c, i) => (i === 0 ? c.toUpperCase() : c))
        .join("");
      return <div className="row">{turnColor}'s turn</div>;
    }

    endGame(playerHasPiecesRemaining, color1, color2);
  };

  return (
    <div className="board d-flex flex-column justify-content-center align-items-center">
      <div className="d-flex row justify-content-center save-and-reset">
        <button className="btn btn-primary" onClick={handleSaveGameRequest}>
          Save
        </button>
        <button className="btn btn-danger" onClick={resetGame}>
          Reset
        </button>
      </div>
      <div className="board-container">{renderBoard()}</div>
      {renderTurnOrGameOverNote()}
      <div className="row">
        {!gameIsOver && (
          <button onClick={handleTurnPass} className="btn btn-info">
            Pass
          </button>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = ({ shapesAndColors, game }: StoreState) => {
  const { pieceShape, pieceColorScheme } = shapesAndColors;
  const {
    playerTurn,
    piecePositions,
    size,
    error,
    playerHasPiecesRemaining,
    currentlySelectedPiecePosition,
  } = game;
  const { errorOn, errorMessage } = error;
  return {
    pieceShape,
    pieceColorScheme,
    playerTurn,
    piecePositions,
    size,
    playerHasPiecesRemaining,
    errorOn,
    errorMessage,
    currentlySelectedPiecePosition,
  };
};

const actions = {
  ...gameActions,
  ...piecePositionsActions,
};

export default connect(mapStateToProps, actions)(Board as any);
