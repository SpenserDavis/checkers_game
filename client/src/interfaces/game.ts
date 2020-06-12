import { ShapesAndColors } from "./shapesAndColors";

export interface ErrorMsg {
  errorOn: string | null;
  errorMessage: string;
}

export enum Pieces {
  empty,
  p1,
  p2,
  p1King,
  p2King,
}

export interface BaseBoardState {
  playerTurn: number;
  piecePositions: Pieces[][];
  size: number;
  playerHasPiecesRemaining: boolean[];
}

export interface SavedGameState extends ShapesAndColors, BaseBoardState {}

export interface BoardLayout extends BaseBoardState {
  currentlySelectedPiecePosition: undefined[] | number[];
  error: ErrorMsg;
}
