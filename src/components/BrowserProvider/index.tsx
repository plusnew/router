import plusnew, { store, Component, Props } from 'plusnew';
import url from '../../contexts/url';
import urlHandler from '../../contexts/urlHandler';
import { isNamespaceActive, createUrl, parseUrl } from '../../util/urlHandler';
import activeRoutesContext, { storeFactory as activeRouteStoreFactory } from 'contexts/activeRoutes';
import ComponentInstance from 'plusnew/dist/src/instances/types/Component/Instance';

type props = {
  children: any;
};

export default class BrowserProvider extends Component<props> {
  static displayName = 'BrowserProvider';
  render(Props: Props<props>, componentInstance: ComponentInstance<any>) {
    const activeRoutes = activeRouteStoreFactory();
    const local = store(this.getPath(), (_state, action: string) => action);

    const update = () => local.dispatch(this.getPath());

    componentInstance.registerLifecycleHook('componentDidMount', () => {
      window.addEventListener('popstate', update);
    });

    componentInstance.registerLifecycleHook('componentWillUnmount', () => {
      window.removeEventListener('popstate', update);
    });

    function changeUrl(url: string) {
      history.pushState({}, '', url);
      return local.dispatch(url);
    }

    const propsRender = (props: { children: any}) => props.children;

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
              <activeRoutes.Observer>{activeRouteState =>
                <activeRoutesContext.Provider state={activeRouteState} dispatch={activeRoutes.dispatch}>
                  <Props>{propsRender}</Props>
                </activeRoutesContext.Provider>
              }</activeRoutes.Observer>
          </url.Provider>
        }</local.Observer>
      </urlHandler.Provider>
    );
  }

  private getPath() {
    return location.pathname + location.search;
  }
}
