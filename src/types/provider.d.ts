import { storeType } from '@plusnew/core';

export type provider = {
  store: storeType<string, any>;
  push: (url: string) => void;
};
