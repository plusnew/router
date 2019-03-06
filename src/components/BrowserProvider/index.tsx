import plusnew, { store, Component, Props } from 'plusnew';
import url from '../../contexts/url';

type props = {
  children: any;
};

export default class Provider extends Component<props> {
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
      <local.Observer>{localState =>
        <url.Provider state={localState} dispatch={changeUrl}>
          <Props>{props => props.children}</Props>
        </url.Provider>
      }</local.Observer>
    );
  }

  private getPath() {
    return location.pathname;
  }
}
