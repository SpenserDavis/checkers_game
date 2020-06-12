import Game, { IGame } from "../models/game";

class CheckersService {
  private static instance: CheckersService;

  static getInstance(): CheckersService {
    if (!CheckersService.instance) {
      CheckersService.instance = new CheckersService();
    }

    return CheckersService.instance;
  }

  saveGame = async (gameInfo: IGame): Promise<string | null> => {
    const game: IGame = new Game({
      ...gameInfo,
    });

    const gameToReturn: IGame = await game.save();
    console.log(gameToReturn);
    return gameToReturn._id;
  };

  deleteGame = async (id: string): Promise<IGame | null> => {
    return await Game.findByIdAndDelete(id).exec();
  };

  getGameById = async (id: string): Promise<IGame | null> => {
    return await Game.findById(id).exec();
  };
}

export default CheckersService;
