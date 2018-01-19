import {FieldSchema, Schema, TableSchema} from 'compassql/build/src/schema';
import {StateWithHistory} from 'redux-undo';
import {Bookmark, DEFAULT_BOOKMARK} from './bookmark';
import {DEFAULT_VOYAGER_CONFIG, VoyagerConfig} from './config';
import {CustomWildcardField, DEFAULT_CUSTOM_WILDCARD_FIELDS} from './custom-wildcard-field';
import {Dataset, DatasetWithoutSchema, DEFAULT_DATASET} from './dataset';
import {DEFAULT_LOG, Log} from './log';
import {DEFAULT_RELATED_VIEWS, RelatedViews} from './related-views';
import {DEFAULT_RESULT_INDEX, ResultIndex} from './result';
import {DEFAULT_SHELF, Shelf} from './shelf';
import {DEFAULT_SHELF_PREVIEW, ShelfPreview} from './shelf-preview';

export * from './bookmark';
export * from './dataset';
export * from './shelf';
export * from './result';
export * from './config';

/**
 * Application state.
 */
export interface PersistentState {
  bookmark: Bookmark;
  config: VoyagerConfig;
  log: Log;
  relatedViews: RelatedViews;
  shelfPreview: ShelfPreview;
}

export interface SingleViewTabStateWithoutDataset {
  customWildcardFields: CustomWildcardField[];
  shelf: Shelf;
  result: ResultIndex;
}

export interface SingleViewTabState extends SingleViewTabStateWithoutDataset {
  dataset: Dataset;
}

export interface UndoableStateBase {
  activeTab: number;
  tabs: SingleViewTabState[];
}

/**
 * Application state (wrapped with redux-undo's StateWithHistory interface).
 */
export interface State {
  persistent: PersistentState;
  undoable: StateWithHistory<UndoableStateBase>;
};

export const DEFAULT_SINGLE_VIEW_TAB_STATE = {
  customWildcardFields: DEFAULT_CUSTOM_WILDCARD_FIELDS,
  dataset: DEFAULT_DATASET,
  shelf: DEFAULT_SHELF,
  result: DEFAULT_RESULT_INDEX
};

export const DEFAULT_UNDOABLE_STATE_BASE: UndoableStateBase = {
  activeTab: 0,
  tabs: [DEFAULT_SINGLE_VIEW_TAB_STATE]
};

export const DEFAULT_UNDOABLE_STATE: StateWithHistory<UndoableStateBase> = {
  past: [],
  present: DEFAULT_UNDOABLE_STATE_BASE,
  future: [],
  _latestUnfiltered: null,
  group: null,
  index: null,
  limit: 30
};

export const DEFAULT_PERSISTENT_STATE: PersistentState = {
  bookmark: DEFAULT_BOOKMARK,
  config: DEFAULT_VOYAGER_CONFIG,
  log: DEFAULT_LOG,
  relatedViews: DEFAULT_RELATED_VIEWS,
  shelfPreview: DEFAULT_SHELF_PREVIEW
};

export const DEFAULT_STATE: State = {
  persistent: DEFAULT_PERSISTENT_STATE,
  undoable: DEFAULT_UNDOABLE_STATE
};

export interface SerializableSingleViewTabState extends SingleViewTabStateWithoutDataset {
  dataset: DatasetWithoutSchema;
  tableschema: TableSchema<FieldSchema>;
}

export interface SerializableState extends PersistentState {
  activeTab: number;
  tabs: SerializableSingleViewTabState[];
}

export function toSerializable(state: Readonly<State>): SerializableState {
  const activeTab = state.undoable.present.activeTab;
  return {
    ...state.persistent,
    activeTab: activeTab,
    tabs: [toSerializableTab(state.undoable.present.tabs[activeTab])]
  };
}

export function toSerializableTab(tabState: Readonly<SingleViewTabState>): SerializableSingleViewTabState {
  const {dataset, ...singleViewTabStateWithoutDataset} = tabState;
  const {schema, ...datasetWithoutSchema} = dataset;

  return {
    ...singleViewTabStateWithoutDataset,
    dataset: datasetWithoutSchema,
    tableschema: schema.tableSchema()
  };
}

export function fromSerializable(serializable: SerializableState): Readonly<State> {
  const {
    // Persistent
    bookmark,
    config,
    log,
    relatedViews,
    shelfPreview,
    // Tabs
    activeTab,
    tabs
  } = serializable;

  const persistent: PersistentState = {bookmark, config, relatedViews, shelfPreview, log};

  return {
    persistent,
    undoable: {
      ...DEFAULT_UNDOABLE_STATE,
      present: {
        activeTab: activeTab,
        tabs: [fromSerializableTab(tabs[activeTab])]
      }
    }
  };
}

export function fromSerializableTab(serializableTabState: SerializableSingleViewTabState)
: Readonly<SingleViewTabState> {
  const {
    dataset: datasetWithoutSchema,
    tableschema,
    ...singleViewTabStateWithoutDataset
  } = serializableTabState;

  return {
    ...singleViewTabStateWithoutDataset,
    dataset: {
      ...datasetWithoutSchema,
      schema : new Schema(serializableTabState.tableschema)
    }
  };
}
