import { ActionTypes } from "./types";

const { EDIT_SHAPE, EDIT_COLORS } = ActionTypes;

export const editShape = (newShape: string) => {
  return { type: EDIT_SHAPE, payload: newShape };
};

export const editColors = (newColors: string) => {
  return { type: EDIT_COLORS, payload: newColors };
};
