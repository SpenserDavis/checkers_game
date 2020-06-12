import React from "react";
import "./board.css";
import { connect } from "react-redux";
import * as actions from "../../actions/piecePositions";
import { StoreState } from "../../reducers";
import { Pieces } from "../../interfaces/game";

export type CheckerPieceProps = {
  color: string;
  pieceShape: string;
  piece: Pieces;
  playerTurn: number;
  position: number[];
  currentlySelectedPiecePosition: number[];
  toggleActivePiece: Function;
};

const CheckerPiece = ({
  color,
  pieceShape,
  piece,
  playerTurn,
  position,
  currentlySelectedPiecePosition,
  toggleActivePiece,
}: CheckerPieceProps) => {
  const { p1, p1King, p2King } = Pieces;

  const [x, y]: number[] = position;
  const [x2, y2]: number[] = currentlySelectedPiecePosition;
  const isSelected: boolean = x === x2 && y === y2;

  const selectActivePiece = (e: React.MouseEvent): void => {
    let currPlayer: number = piece === p1 || piece === p1King ? 1 : 2;
    if (currPlayer !== playerTurn) {
      return;
    }

    e.stopPropagation();
    toggleActivePiece(x, y);
  };

  //triangles are tricky, so there are a few added css rules for them
  const getShapeAndColor = (): string => {
    if (pieceIsTriangular()) {
      return `triangular ${color}-triangular`;
    }
    return `${color} ${pieceShape}`;
  };

  const pieceIsKing = (): boolean => {
    return piece === p1King || piece === p2King;
  };

  const pieceIsTriangular = (): boolean => {
    return pieceShape === "triangular";
  };

  return (
    <div className="pieceBox">
      <div
        onClick={selectActivePiece}
        className={`checkerPiece ${getShapeAndColor()} ${
          isSelected && !pieceIsTriangular() ? "active-piece" : ""
        }`}
      >
        {pieceIsKing() && !pieceIsTriangular() && <h6 className="king">K</h6>}
      </div>
      {pieceIsKing() && pieceIsTriangular() && (
        <h6 className={`${pieceShape} king`}>K</h6>
      )}
      {isSelected && pieceIsTriangular() && (
        <div className={`checkerPiece ${"active-triangle"}`}></div>
      )}
    </div>
  );
};

const mapStateToProps = ({ game }: StoreState) => {
  const { currentlySelectedPiecePosition } = game;
  return { currentlySelectedPiecePosition };
};

export default connect(mapStateToProps, actions)(CheckerPiece as any);
