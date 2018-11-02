import plusnew , { Component, store, Props } from 'plusnew';

type props = { children: any };

export default () => {
  return class Invalid extends Component<props> {
    static store = store(false, (_state, action: boolean) => action);
    render(Props: Props<props>) {
      return <Props>
        {props =>
          <Invalid.store.Observer>
            {state => state === true ? props.children : null}
          </Invalid.store.Observer>
      }</Props>;
    }
  };
};
