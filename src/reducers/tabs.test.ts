import {TAB_ADD, TAB_REMOVE_ACTIVE, TAB_SWITCH} from '../actions/tab';
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
    it('should set activeTabID to switchToTab', () => {
      const oldTabs: Tabs = {
        activeTabID: 2,
        list: [DEFAULT_SINGLE_VIEW_TAB_STATE, DEFAULT_SINGLE_VIEW_TAB_STATE, DEFAULT_SINGLE_VIEW_TAB_STATE]
      };
      const newTabs: Tabs = tabsReducer(oldTabs, {type: TAB_SWITCH, payload: {switchToTab: 1}});
      expect(newTabs.activeTabID).toEqual(1);
    });

    it('should return the old state if the switch to tab is already active', () => {
      const oldTabs: Tabs = {
        activeTabID: 2,
        list: [DEFAULT_SINGLE_VIEW_TAB_STATE, DEFAULT_SINGLE_VIEW_TAB_STATE, DEFAULT_SINGLE_VIEW_TAB_STATE]
      };
      const newTabs: Tabs = tabsReducer(oldTabs, {type: TAB_SWITCH, payload: {switchToTab: 2}});
      expect(newTabs).toBe(oldTabs);
    });
  });

  describe(TAB_REMOVE_ACTIVE, () => {
    it('should not remove tab if tab list has only one tab', () => {
      const oldTabs = {
        activeTabID: 0,
        list: [DEFAULT_SINGLE_VIEW_TAB_STATE]
      };
      const newTabs: Tabs = tabsReducer(oldTabs, {type: TAB_REMOVE_ACTIVE});
      expect(newTabs.list.length).toEqual(1);
      expect(newTabs.activeTabID).toEqual(0);
    });

    it('should remove the active tab, and set the next tab active', () => {
      const oldTabs = {
        activeTabID: 1,
        list: [DEFAULT_SINGLE_VIEW_TAB_STATE, DEFAULT_SINGLE_VIEW_TAB_STATE, DEFAULT_SINGLE_VIEW_TAB_STATE]
      };
      const newTabs: Tabs = tabsReducer(oldTabs, {type: TAB_REMOVE_ACTIVE});
      expect(newTabs.list.length).toEqual(2);
      expect(newTabs.activeTabID).toEqual(1);
    });

    it('should set the last tab in the list active if no tab exists after the currently active tab', () => {
      const oldTabs = {
        activeTabID: 2,
        list: [DEFAULT_SINGLE_VIEW_TAB_STATE, DEFAULT_SINGLE_VIEW_TAB_STATE, DEFAULT_SINGLE_VIEW_TAB_STATE]
      };
      const newTabs: Tabs = tabsReducer(oldTabs, {type: TAB_REMOVE_ACTIVE});
      expect(newTabs.list.length).toEqual(2);
      expect(newTabs.activeTabID).toEqual(1);
    });
  });
});
