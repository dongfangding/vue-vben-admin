export type DictMatchField = 'detailCode' | 'value';

export interface DictMatchConfig {
  matchField?: DictMatchField;
}

export interface DictOptionItem {
  dictCode?: string;
  detailCode?: string;
  dictSort?: number;
  label: string;
  value: string;
  [key: string]: any;
}

export interface DictBucket {
  detailCodeMap: Map<string, DictOptionItem>;
  error: null | unknown;
  fetchedAt: null | number;
  items: DictOptionItem[];
  loaded: boolean;
  loading: boolean;
  pendingPromise?: Promise<DictBucket>;
  valueMap: Map<string, DictOptionItem>;
}
