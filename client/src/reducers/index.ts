import { combineReducers } from "redux";
import shapesAndColorsReducer from "./shapesAndColors";
import piecePositionsReducer from "./game";
import { BoardLayout } from "../interfaces/game";
import { ShapesAndColors } from "../interfaces/shapesAndColors";

export interface StoreState {
  game: BoardLayout;
  shapesAndColors: ShapesAndColors;
}

export default combineReducers<StoreState>({
  game: piecePositionsReducer,
  shapesAndColors: shapesAndColorsReducer,
});
