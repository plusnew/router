import { storeType } from 'plusnew';

export type provider = {
  store: storeType<string, any>;
  push: (url: string) => void;
};
