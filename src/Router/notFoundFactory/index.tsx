import plusnew , { Component, store, Props } from 'plusnew';

type props = { children: any };

export default () => {
  return class NotFound extends Component<props> {
    static store = store(true, (_state, action: boolean) => action);
    render(Props: Props<props>) {
      return <Props render={props =>
        <NotFound.store.Observer render={(state) => {
          if (state === true) {
            return props.children;
          }
          return null;
        }} />
      } />;
    }
  };
};
