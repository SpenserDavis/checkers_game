import React from "react";
import CheckerPiece from "./CheckerPiece";
import { Pieces } from "../../interfaces/game";
import { MovementInfo } from "./Board";

type SquareProps = {
  position: number[];
  piece: Pieces;
  color: string;
  pieceShape: string;
  playerTurn: number;
  eligibleDestination: MovementInfo | null;
  tryMoveSelectedPiece: Function;
};

const Square = ({
  position,
  piece,
  color,
  pieceShape,
  playerTurn,
  eligibleDestination,
  tryMoveSelectedPiece,
}: SquareProps): React.ReactElement<any> => {
  const [i, j]: number[] = position;

  const selectDestination = (): void => {
    if (!eligibleDestination) {
      return;
    }
    tryMoveSelectedPiece(eligibleDestination);
  };

  const renderCheckerPiece = (): React.ReactElement<any> => {
    const checkerPieceProps = {
      playerTurn,
      pieceShape,
      position,
      piece,
      color,
    };

    return <CheckerPiece {...checkerPieceProps} />;
  };

  //adjusts the background color of the square based on it's row and column position
  const getSquareClassName = (): string => {
    let className: string = "square ";

    if (i % 2 === 0) {
      className += j % 2 === 0 ? "square-dark" : "square-light";
    } else {
      className += j % 2 !== 0 ? "square-dark" : "square-light";
    }

    if (eligibleDestination) {
      className += " eligible-move";
    }

    return className;
  };

  return (
    <div onClick={selectDestination} className={getSquareClassName()}>
      {piece !== Pieces.empty && renderCheckerPiece()}
    </div>
  );
};

export default Square;
