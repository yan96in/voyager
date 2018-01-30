import {PlainReduxAction, ReduxAction} from './redux-action';

export type TabAction = TabAdd | TabRemoveActive | TabSwitch | TabTitleUpdate;

export const TAB_ADD = 'TAB_ADD';
export type TabAdd = PlainReduxAction<typeof TAB_ADD>;

export const TAB_REMOVE_ACTIVE = 'TAB_REMOVE_ACTIVE';
export type TabRemoveActive = PlainReduxAction<typeof TAB_REMOVE_ACTIVE>;

export const TAB_SWITCH = 'TAB_SWITCH';
export type TabSwitch = ReduxAction<typeof TAB_SWITCH, {
  switchToTab: number;
}>;

export const TAB_TITLE_UPDATE = 'TAB_TITLE_UPDATE';
export type TabTitleUpdate = ReduxAction<typeof TAB_TITLE_UPDATE, {
  newTitle: string;
}>;
