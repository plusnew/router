import plusnew, { component, store, Props } from 'plusnew';
import { ApplicationElement } from 'plusnew/dist/src/interfaces/component';

const hasRoute = store(false, (_state, action: boolean) => action);
export { hasRoute };

export default component(
  'ComponentRoute',
  (Props: Props<{ children: ApplicationElement[] }>) =>
    <hasRoute.Observer render={hasRoute => {
      if (hasRoute === true) {
        return null;
      }
      return <Props render={(props) => plusnew.createElement(plusnew.Fragment, {}, ...props.children)} />;
    }} />
);
