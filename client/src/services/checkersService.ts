import axios, { AxiosRequestConfig } from "axios";
import { SavedGameState } from "../interfaces/game";

const endpoint = "/checkers";

export const getGameById = (gameId: string) => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${endpoint}/${gameId}`,
  };
  return axios(config);
};

export const saveGame = (data: SavedGameState) => {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: endpoint,
    data,
  };

  return axios(config);
};

export const deleteGame = (gameId: string) => {
  const config: AxiosRequestConfig = {
    method: "DELETE",
    url: `${endpoint}/${gameId}`,
  };

  return axios(config);
};
