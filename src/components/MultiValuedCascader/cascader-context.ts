/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';
import { OptionItemDTO, OptionValue } from './typing'

/**
 * 设置搜索值到state
 */
// export type SetSearchTextFunc = (string) => void;

/**
 * 设置搜索值到state
 */
// export type RemoveItemFunc = (OptionValue) => void;

export interface ContextModelType {
  searchText: string;
  setSearchText: (string) => void;
  selected: OptionItemDTO[];
  inputFocused: boolean;
  removeItem: (OptionValue) => void;
  changeInputFocused(boolean): void;
  setSelected(arg0: OptionItemDTO[]): void;
}

const contextModel: ContextModelType = {
  searchText: '',
  setSearchText: () => { },
  selected: [],
  inputFocused: false,
  removeItem: () => { },
  changeInputFocused: () => { },
  setSelected: () => { },
};

let context = createContext(contextModel);

export const { Provider, Consumer } = context;

export default context;
