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
  activeTabID: number;
  list: SingleViewTabState[];
}

export const DEFAULT_ACTIVE_TAB_ID = 0;

export const DEFAULT_TABS = {
  activeTabID: DEFAULT_ACTIVE_TAB_ID,
  list: [DEFAULT_SINGLE_VIEW_TAB_STATE]
};
