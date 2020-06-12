import {
  GetGameAction,
  SaveGameAction,
  GameErrorAction,
  EditShapeAction,
  EditColorAction,
  EditSizeAction,
  ResetPositionsAction,
  TogglePieceAction,
  ToggleTurnAction,
  MovePieceAction,
} from "../interfaces/actions";

export enum ActionTypes {
  GET_GAME_BY_ID,
  SAVE_GAME,
  GAME_ERROR,
  EDIT_SHAPE,
  EDIT_COLORS,
  MOVE_PIECE,
  TOGGLE_PIECE,
  RESET_POSITIONS,
  EDIT_SIZE,
  TOGGLE_TURN,
}

export type Action =
  | GetGameAction
  | SaveGameAction
  | GameErrorAction
  | EditShapeAction
  | EditColorAction
  | EditSizeAction
  | ResetPositionsAction
  | TogglePieceAction
  | ToggleTurnAction
  | MovePieceAction;
