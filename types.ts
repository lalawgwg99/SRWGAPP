
export interface MapGroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeId?: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        reviewText: string;
      }[];
    };
  };
}

export interface StoreInfo {
  name: string;
  address: string;
  phone: string;
  hours: string;
  distance: string;
}

export interface SearchResult {
  stores: StoreInfo[];
  rawText: string;
  groundingChunks: MapGroundingChunk[];
}

export interface FeeSchedule {
  price: string;
  range: string;
  note: string;
}

export interface StoreFeeData {
  id: string; // Unique identifier generated from sheet index (e.g. "sheet_0")
  storeName: string; // The parsed name of the store group (e.g. "LR", "愛河/鳳山/澄清店")
  schedules: FeeSchedule[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export enum AppMode {
  FIND_STORE = 'FIND_STORE',
  CHECK_FEE = 'CHECK_FEE'
}
