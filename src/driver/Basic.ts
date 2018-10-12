import { store, storeType } from 'plusnew';

export default class DummyDriver {
  store: storeType<string, string>;
  constructor(startUrl: string) {
    this.store = store(startUrl, (_state, action: string) => action);
  }

  push(url: string) {
    this.store.dispatch(url);
  }
}
