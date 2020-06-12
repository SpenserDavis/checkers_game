import { ActionTypes } from "../actions/types";
import { BoardLayout } from "../interfaces/game";
import { Action } from "../actions/types";
import { Pieces } from "../interfaces/game";

const {
  MOVE_PIECE,
  TOGGLE_PIECE,
  RESET_POSITIONS,
  GET_GAME_BY_ID,
  EDIT_SIZE,
  GAME_ERROR,
  TOGGLE_TURN,
} = ActionTypes;

const DEFAULT_GAME_STATE: BoardLayout = {
  piecePositions: [],
  playerTurn: 1,
  size: 0,
  playerHasPiecesRemaining: [true, true],
  currentlySelectedPiecePosition: [undefined, undefined],
  error: { errorOn: null, errorMessage: "" },
};

const { empty, p1, p2 } = Pieces;

const initializePiecePositions = (n: number) => {
  const initialPiecePositions = new Array(n);
  for (let i = 0; i < n; i++) {
    initialPiecePositions[i] = new Array(n).fill(empty);
    for (let j = 0; j < n; j++) {
      if ((i === 0 && j % 2 === 0) || (i === 1 && j % 2 !== 0)) {
        initialPiecePositions[i][j] = p1;
      } else {
        if (n % 2 === 0) {
          if ((i === n - 1 && j % 2 !== 0) || (i === n - 2 && j % 2 === 0)) {
            initialPiecePositions[i][j] = p2;
          }
        } else {
          if ((i === n - 1 && j % 2 === 0) || (i === n - 2 && j % 2 !== 0)) {
            initialPiecePositions[i][j] = p2;
          }
        }
      }
    }
  }

  //0 = unoccupied, 1 = player1, 2 = player2, 3 = player1 King, 4 = player2 King
  return initialPiecePositions;
};

export default function (
  state: BoardLayout = { ...DEFAULT_GAME_STATE },
  action: Action
) {
  let n: number;
  switch (action.type) {
    case EDIT_SIZE:
      n = action.payload;
      return {
        ...state,
        piecePositions: initializePiecePositions(n),
        playerTurn: 1,
        size: n,
        error: { errorOn: null, errorMessage: "" },
      };
    case TOGGLE_PIECE:
      const [x, y]:
        | number[]
        | undefined[] = state.currentlySelectedPiecePosition;
      const [x2, y2] = action.payload;
      if (x === x2 && y === y2) {
        return {
          ...state,
          currentlySelectedPiecePosition: [undefined, undefined],
        };
      }
      return {
        ...state,
        currentlySelectedPiecePosition: action.payload,
      };
    case TOGGLE_TURN:
      return {
        ...state,
        playerTurn: state.playerTurn === 1 ? 2 : 1,
      };
    case MOVE_PIECE:
      return {
        ...state,
        piecePositions: action.payload.updatedPiecePositions,
        playerHasPiecesRemaining: action.payload.playerHasPiecesRemaining,
        playerTurn: action.payload.nextPlayerTurn,
        currentlySelectedPiecePosition: [undefined, undefined],
        error: { errorOn: null, errorMessage: "" },
      };
    case RESET_POSITIONS:
      n = state.size;
      const piecePositions = initializePiecePositions(n);
      return {
        ...state,
        piecePositions,
        playerTurn: 1,
        playerHasPiecesRemaining: [true, true],
        currentlySelectedPiecePosition: [undefined, undefined],
        error: { errorOn: null, errorMessage: "" },
      };
    case GET_GAME_BY_ID:
      return {
        ...state,
        playerTurn: action.payload.playerTurn,
        piecePositions: action.payload.piecePositions,
        size: action.payload.size,
        playerHasPiecesRemaining: action.payload.playerHasPiecesRemaining,
        currentlySelectedPiecePosition: [undefined, undefined],
        error: { errorOn: null, errorMessage: "" },
      };
    case GAME_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}
