import mongoose, { Schema, Document } from "mongoose";

enum Pieces {
  empty,
  p1,
  p2,
  p1King,
  p2King,
}

export interface IGame extends Document {
  pieceColorScheme: string;
  pieceShape: string;
  playerTurn: number;
  piecePositions: Pieces[][];
  size: number;
  playerHasPiecesRemaining: boolean[];
}

const gameSchema: Schema = new Schema({
  pieceColorScheme: { type: String, required: true },
  pieceShape: { type: String, required: true },
  playerTurn: { type: Number, required: true },
  piecePositions: { type: Array, required: true },
  size: { type: Number, required: true },
  playerHasPiecesRemaining: { type: Array, required: true },
});

const Game = mongoose.model<IGame>("Game", gameSchema);

export default Game;
