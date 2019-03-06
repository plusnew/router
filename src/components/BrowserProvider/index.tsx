import plusnew, { store, Component, Props } from 'plusnew';
import url from '../../contexts/url';
import urlHandler from '../../contexts/urlHandler';
import { isNamespaceActive, createUrl, parseUrl } from '../../util/urlHandler';

type props = {
  children: any;
};

export default class BrowserProvider extends Component<props> {
  static displayName = 'BrowserProvider';
  render(Props: Props<props>) {
    const local = store(this.getPath(), (_state, action: string) => action);

    // @TODO removeEventListener
    window.addEventListener('popstate', () => {
      local.dispatch(this.getPath());
    });

    function changeUrl(url: string) {
      history.pushState({}, '', url);
      return local.dispatch(url);
    }
    return (
      <urlHandler.Provider
        state={{
          isNamespaceActive,
          createUrl,
          parseUrl,
        }}
        dispatch={null as never}
      >
        <local.Observer>{localState =>
          <url.Provider state={localState} dispatch={changeUrl}>
            <Props>{props => props.children}</Props>
          </url.Provider>
        }</local.Observer>
      </urlHandler.Provider>
    );
  }

  private getPath() {
    return location.pathname;
  }
}
