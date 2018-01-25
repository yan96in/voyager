import {PlainReduxAction, ReduxAction} from './redux-action';

export type TabAction = TabAdd | TabRemove | TabSwitch;

export const TAB_ADD = 'TAB_ADD';
export type TabAdd = PlainReduxAction<typeof TAB_ADD>;

export const TAB_REMOVE = 'TAB_REMOVE';
export type TabRemove = ReduxAction<typeof TAB_REMOVE, {
  tabToRemove: number;
}>;

export const TAB_SWITCH = 'TAB_SWITCH';
export type TabSwitch = ReduxAction<typeof TAB_SWITCH, {
  switchToTab: number;
}>;
