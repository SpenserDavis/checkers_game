import { get, post, del } from "./decorators/routes";
import controller from "./decorators/controller";
import use from "./decorators/use";
import Game, { IGame } from "../models/game";
import CheckersService from "../services/CheckersService";
import { logger, RequestWithBody } from "../controllers";
import { NextFunction, Response, Request } from "express";

@controller("/checkers")
class CheckersController {
  @get("/:id")
  @use(logger)
  async getGameById(
    req: RequestWithBody,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("controller get");

      const game: IGame | null = await CheckersService.getGameById(
        req.params.id
      );
      console.log("outside");
      if (!game) {
        res.status(404).send("App resource not found.");
      }
      res.send(game);
    } catch (err) {
      this.onError(err, res);
    }
  }

  @post("/")
  async saveGame(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const gameId: string | null = await CheckersService.saveGame(req.body);

      res.status(201).send({ id: gameId });
    } catch (err) {
      this.onError(err, res);
    }
  }

  @del("/:id")
  async deleteGame(
    req: RequestWithBody,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const game: IGame | null = await CheckersService.deleteGame(
        req.params.id
      );
      if (!game) {
        res.status(404).send("App resource not found.");
        return;
      }

      const response = { message: "Game successfully deleted.", id: game._id };
      res.status(200).send(response);
    } catch (err) {
      this.onError(err, res);
    }
  }

  onError(res: Response, err: any) {
    console.log("error", err);
    res.status(500).send(err.toString());
  }
}

export default new CheckersController();
