import {DEFAULT_RESULT_INDEX, ResultIndex} from './result';
import {DEFAULT_SHELF, Shelf} from './shelf';

export interface SingleViewTabState {
  shelf: Shelf;
  result: ResultIndex;
}

export const DEFAULT_SINGLE_VIEW_TAB_STATE = {
  shelf: DEFAULT_SHELF,
  result: DEFAULT_RESULT_INDEX
};

export interface Tabs {
  activeTab: number;
  list: SingleViewTabState[];
}

export const DEFAULT_ACTIVE_TAB = 0;

export const DEFAULT_TABS = {
  activeTab: DEFAULT_ACTIVE_TAB,
  list: [DEFAULT_SINGLE_VIEW_TAB_STATE]
};
