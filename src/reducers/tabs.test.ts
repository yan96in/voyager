import {TAB_ADD, TAB_REMOVE, TAB_SWITCH} from '../actions/tab';
import {DEFAULT_SINGLE_VIEW_TAB_STATE, Tabs} from '../models';
import {tabsReducer} from './tabs';

describe('reducers/tabs', () => {
  describe(TAB_ADD, () => {
    it('should add a new tab to the end of the list, and set activeTabID to the new tab', () => {
      const oldTabs: Tabs = {
        activeTabID: 1,
        list: [DEFAULT_SINGLE_VIEW_TAB_STATE,
          DEFAULT_SINGLE_VIEW_TAB_STATE,
          DEFAULT_SINGLE_VIEW_TAB_STATE]
      };
      const newTabs: Tabs = tabsReducer(oldTabs, {type: TAB_ADD});
      expect(newTabs.activeTabID).toEqual(3);
      expect(newTabs.list.length).toEqual(4);
    });

    it('should initialize the newly added tab with defaults', () => {
      const oldTabs: Tabs = {
        activeTabID: 0,
        list: [DEFAULT_SINGLE_VIEW_TAB_STATE]
      };
      const newTabs: Tabs = tabsReducer(oldTabs, {type: TAB_ADD});
      expect(newTabs.list[newTabs.list.length - 1]).toEqual(DEFAULT_SINGLE_VIEW_TAB_STATE);
    });
  });

  describe(TAB_SWITCH, () => {
    //
  });

  describe(TAB_REMOVE, () => {
    //
  });
});
