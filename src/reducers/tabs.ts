import {combineReducers} from 'redux';
import {Action, RESULT_ACTION_TYPE_INDEX, ResultAction, ShelfAction} from '../actions';
import {SPEC_ACTION_TYPE_INDEX} from '../actions/shelf/spec';
import {DEFAULT_SINGLE_VIEW_TAB_STATE, DEFAULT_TABS, SingleViewTabState, Tabs} from '../models';
import {resultIndexReducer} from './result';
import {shelfReducer} from './shelf';
import {modifyItemInArray, removeItemFromArray} from './util';

import {
  TAB_ADD,
  TAB_REMOVE_ACTIVE,
  TAB_SWITCH
} from '../actions';


// TODO: Remove CustomWildcardAction, DatasetAction from this type
export type SingleViewTabAction = (
  ResultAction |
  ShelfAction
);

export type SingleViewTabActionType = SingleViewTabAction['type'];

export const SINGLE_VIEW_TAB_ACTION_TYPE_INDEX: {[k in SingleViewTabActionType]: 1} = {
  ...RESULT_ACTION_TYPE_INDEX,

  FILTER_ADD: 1,
  FILTER_CLEAR: 1,
  FILTER_MODIFY_EXTENT: 1,
  FILTER_MODIFY_MAX_BOUND: 1,
  FILTER_MODIFY_MIN_BOUND: 1,
  FILTER_MODIFY_TIME_UNIT: 1,
  FILTER_MODIFY_ONE_OF: 1,
  FILTER_REMOVE: 1,
  FILTER_TOGGLE: 1,

  SHELF_LOAD_QUERY: 1,
  SHELF_AUTO_ADD_COUNT_CHANGE: 1,
  SHELF_GROUP_BY_CHANGE: 1,

  ...SPEC_ACTION_TYPE_INDEX
};

export function isSingleViewTabAction(action: Action): action is SingleViewTabAction {
  return SINGLE_VIEW_TAB_ACTION_TYPE_INDEX[action.type];
}

const combineSingleViewTabReducer = combineReducers<SingleViewTabState>({
  shelf: shelfReducer,
  result: resultIndexReducer
});

export function tabsReducer(tabs: Readonly<Tabs> = DEFAULT_TABS, action: Action): Tabs {
  // multi-tab actions
  const {activeTabID, list} = tabs;
  switch (action.type) {
    case TAB_ADD:
      return {
        activeTabID: list.length, // set the new tab active
        list: [...list, DEFAULT_SINGLE_VIEW_TAB_STATE]
      };

    case TAB_REMOVE_ACTIVE:
      if (list.length === 1) { // if only one tab, don't remove
        return tabs;
      }
      // set next tab, or the last tab in the list, active
      const newActiveTabID = (activeTabID === (list.length - 1)) ? list.length - 2 : activeTabID;
      return {
        activeTabID: newActiveTabID,
        list: removeItemFromArray(list, activeTabID).array
      };

    case TAB_SWITCH:
      return {
        ...tabs,
        activeTabID: action.payload.switchToTab
      };
  }

  // single-tab actions
  if (isSingleViewTabAction(action)) {
    return {
      ...tabs,
      list: modifyItemInArray(tabs.list, tabs.activeTabID, // Question: Is this ok? Must I use action.payload.tabID?
        (singleViewTabState: SingleViewTabState) => combineSingleViewTabReducer(singleViewTabState, action))
    };
  }

  return tabs;
}
