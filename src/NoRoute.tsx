import plusnew, { component, store, Props } from 'plusnew';

const hasRoute = store(false, (_state, action: boolean) => action);
export { hasRoute };

export default component(
  'ComponentRoute',
  (Props: Props<{ children: any }>) =>
    <hasRoute.Observer render={hasRoute => {
      if (hasRoute === true) {
        return null;
      }
      return <Props render={(props) => props.children.length === 1 ? props.children[0] : props.children} />;
    }} />
);
