import {FieldSchema, Schema, TableSchema} from 'compassql/build/src/schema';
import {StateWithHistory} from 'redux-undo';
import {Bookmark, DEFAULT_BOOKMARK} from './bookmark';
import {DEFAULT_VOYAGER_CONFIG, VoyagerConfig} from './config';
import {CustomWildcardField, DEFAULT_CUSTOM_WILDCARD_FIELDS} from './custom-wildcard-field';
import {Dataset, DatasetWithoutSchema, DEFAULT_DATASET} from './dataset';
import {DEFAULT_LOG, Log} from './log';
import {DEFAULT_RELATED_VIEWS, RelatedViews} from './related-views';
import {DEFAULT_SHELF_PREVIEW, ShelfPreview} from './shelf-preview';
import {DEFAULT_TABS, Tabs} from './tabs';

export * from './bookmark';
export * from './dataset';
export * from './shelf';
export * from './result';
export * from './config';
export * from './tabs';

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

export interface UndoableStateBaseWithoutDataset {
  customWildcardFields: CustomWildcardField[];
  tabs: Tabs;
}

export interface UndoableStateBase extends UndoableStateBaseWithoutDataset {
  dataset: Dataset;
}

/**
 * Application state (wrapped with redux-undo's StateWithHistory interface).
 */
export interface GenericState<U extends UndoableStateBase> {
  persistent: PersistentState;
  undoable: StateWithHistory<U>;
};

export type State = GenericState<UndoableStateBase>;

export const DEFAULT_UNDOABLE_STATE_BASE: UndoableStateBase = {
  dataset: DEFAULT_DATASET,
  customWildcardFields: DEFAULT_CUSTOM_WILDCARD_FIELDS,
  tabs: DEFAULT_TABS,
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

export interface SerializableState extends PersistentState, UndoableStateBaseWithoutDataset {
  dataset: DatasetWithoutSchema;
  tableschema: TableSchema<FieldSchema>;
}

export function toSerializable(state: Readonly<State>): SerializableState {
  const {dataset, ...undoableStateWithoutDataset} = state.undoable.present;
  const {schema, ...datasetWithoutSchema} = dataset;

  return {
    ...state.persistent,
    ...undoableStateWithoutDataset,
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
    // Undoable
    tabs,
    dataset: datasetWithoutSchema,
    tableschema,
    customWildcardFields
  } = serializable;

  const persistent: PersistentState = {bookmark, config, relatedViews, shelfPreview, log};
  const undoableWithoutDataset: UndoableStateBaseWithoutDataset = {customWildcardFields, tabs};

  return {
    persistent,
    undoable: {
      ...DEFAULT_UNDOABLE_STATE,
      present: {
        ...undoableWithoutDataset,
        dataset: {
          ...datasetWithoutSchema,
          schema: new Schema(tableschema)
        }
      }
    }
  };
}
