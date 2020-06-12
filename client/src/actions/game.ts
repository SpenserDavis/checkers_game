import { ActionTypes } from "./types";
import * as checkersService from "../services/checkersService";
import Swal from "sweetalert2";
import { Dispatch } from "redux";
import {
  GetGameAction,
  GameErrorAction,
  SaveGameAction,
} from "../interfaces/actions";
import { SavedGameState } from "../interfaces/game";
import { AxiosResponse } from "axios";

const { GET_GAME_BY_ID, GAME_ERROR, SAVE_GAME } = ActionTypes;

export const getGameById = (id: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  try {
    const res: AxiosResponse<SavedGameState> = await checkersService.getGameById(
      id
    );
    dispatch<GetGameAction>({ type: GET_GAME_BY_ID, payload: res.data });
  } catch (err) {
    dispatch<GameErrorAction>({
      type: GAME_ERROR,
      payload: { errorOn: "get", errorMessage: "Error retrieving saved game." },
    });
  }
};

export const deleteGame = (id: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  try {
    await checkersService.deleteGame(id);
  } catch (err) {
    dispatch<GameErrorAction>({
      type: GAME_ERROR,
      payload: { errorOn: "delete", errorMessage: "Error deleting game." },
    });
  }
};

export const saveGame = (gameData: SavedGameState) => async (
  dispatch: Dispatch
): Promise<void> => {
  try {
    const res: AxiosResponse<{
      id: string;
      gameData: SavedGameState;
    }> = await checkersService.saveGame(gameData);
    dispatch<SaveGameAction>({
      type: SAVE_GAME,
      payload: { id: res.data.id, gameData },
    });
    localStorage.setItem("gameId", res.data.id);
    Swal.fire({
      title: "Game saved!",
      icon: "success",
    });
  } catch (err) {
    dispatch<GameErrorAction>({
      type: GAME_ERROR,
      payload: {
        errorOn: "save",
        errorMessage: "Unable to save game. Please try again later.",
      },
    });
  }
};
