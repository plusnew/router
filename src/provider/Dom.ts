import { store } from 'plusnew';

export default class DomProvider {
  public store = store(this.getPath(), (_state, action: string) => action);

  constructor() {
    window.addEventListener('popstate', () => {
      this.store.dispatch(this.getPath());
    });
  }

  public push(url: string) {
    history.pushState({}, '', url);
    this.store.dispatch(url);
  }

  private getPath() {
    return location.pathname;
  }
}
