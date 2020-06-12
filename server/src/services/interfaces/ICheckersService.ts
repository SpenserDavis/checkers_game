import { IGame } from "../../models/game";
import CheckersService from "../CheckersService";

export interface ICheckersService {
  getInstance(): CheckersService;

  saveGame(gameInfo: IGame): Promise<string | null>;

  deleteGame(id: string): Promise<IGame | null>;

  getGameById(id: string): Promise<IGame | null>;
}

export default ICheckersService;
