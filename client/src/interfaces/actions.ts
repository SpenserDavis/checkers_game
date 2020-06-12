import { ActionTypes } from "../actions/types";
import { SavedGameState, ErrorMsg, BoardLayout } from "./game";

export interface GetGameAction {
  type: ActionTypes.GET_GAME_BY_ID;
  payload: SavedGameState;
}

export interface SaveGameAction {
  type: ActionTypes.SAVE_GAME;
  payload: { id: string; gameData: SavedGameState };
}

export interface GameErrorAction {
  type: ActionTypes.GAME_ERROR;
  payload: ErrorMsg;
}

export interface EditShapeAction {
  type: ActionTypes.EDIT_SHAPE;
  payload: string;
}

export interface EditColorAction {
  type: ActionTypes.EDIT_COLORS;
  payload: string;
}

export interface EditSizeAction {
  type: ActionTypes.EDIT_SIZE;
  payload: number;
}

export interface ResetPositionsAction {
  type: ActionTypes.RESET_POSITIONS;
}

export interface TogglePieceAction {
  type: ActionTypes.TOGGLE_PIECE;
  payload: number[];
}

export interface MovePieceAction {
  type: ActionTypes.MOVE_PIECE;
  payload: {
    updatedPiecePositions: BoardLayout["piecePositions"];
    nextPlayerTurn: BoardLayout["playerTurn"];
    playerHasPiecesRemaining: BoardLayout["playerHasPiecesRemaining"];
  };
}

export interface ToggleTurnAction {
  type: ActionTypes.TOGGLE_TURN;
}
