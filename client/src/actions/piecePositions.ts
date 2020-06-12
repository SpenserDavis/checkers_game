import { ActionTypes } from "./types";
import { Dispatch } from "redux";
import { MovePieceAction } from "../interfaces/actions";
import { Pieces } from "../interfaces/game";

const {
  MOVE_PIECE,
  RESET_POSITIONS,
  TOGGLE_PIECE,
  EDIT_SIZE,
  TOGGLE_TURN,
} = ActionTypes;

const { p1, p1King, p2King } = Pieces;

export const movePiece = (
  currentlySelectedPiecePosition: number[],
  destination: number[],
  movementIncludesPromotion: boolean,
  skippedSquares: number[][]
) => (dispatch: Dispatch, getState: Function) => {
  const { piecePositions, playerTurn } = getState().game;
  const [startX, startY]: number[] = currentlySelectedPiecePosition;
  const [destinationX, destinationY] = destination;
  const playerHasPiecesRemaining = [false, false];
  const updatedPiecePositions = piecePositions.map((row: number[], i: number) =>
    row.map((piece, j) => {
      if ((i === startX && j === startY) || `${i}-${j}` in skippedSquares) {
        return 0;
      } else if (i === destinationX && j === destinationY) {
        playerHasPiecesRemaining[playerTurn - 1] = true;

        if (movementIncludesPromotion) {
          return playerTurn === 1 ? p1King : p2King;
        } else {
          return playerTurn;
        }
      } else {
        const playerPieceExists = piece !== 0;
        if (playerPieceExists) {
          const piecesRemainingIdx = piece === p1 || piece === p1King ? 0 : 1;
          playerHasPiecesRemaining[piecesRemainingIdx] = true;
        }

        return piece;
      }
    })
  );

  let nextPlayerTurn = playerTurn === 1 ? 2 : 1;

  return dispatch<MovePieceAction>({
    type: MOVE_PIECE,
    payload: {
      updatedPiecePositions,
      nextPlayerTurn,
      playerHasPiecesRemaining,
    },
  });
};

export const toggleActivePiece = (i: number, j: number) => {
  return {
    type: TOGGLE_PIECE,
    payload: [i, j],
  };
};

export const toggleTurn = () => {
  return { type: TOGGLE_TURN };
};

export const resetPositions = () => {
  return {
    type: RESET_POSITIONS,
  };
};

export const editSize = (size: number) => {
  return { type: EDIT_SIZE, payload: size };
};
