import { ActionTypes } from "../actions/types";
import { Action } from "../actions/types";
import { ShapesAndColors } from "../interfaces/shapesAndColors";
const DEFAULT_GAME_STATE = {
  pieceShape: "circular",
  pieceColorScheme: "red-black",
};

const { EDIT_COLORS, EDIT_SHAPE, GET_GAME_BY_ID } = ActionTypes;

export default function (
  state: ShapesAndColors = { ...DEFAULT_GAME_STATE },
  action: Action
) {
  switch (action.type) {
    case EDIT_COLORS:
      return {
        ...state,
        pieceColorScheme: action.payload,
      };
    case EDIT_SHAPE:
      return {
        ...state,
        pieceShape: action.payload,
      };
    case GET_GAME_BY_ID:
      return {
        ...state,
        pieceShape: action.payload.pieceShape,
        pieceColorScheme: action.payload.pieceColorScheme,
      };
    default:
      return state;
  }
}
