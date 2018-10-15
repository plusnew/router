import plusnew, { ApplicationElement, Component, Props } from 'plusnew';
import { props } from 'plusnew/dist/src/interfaces/component';
import { RouteParamsSpec, SpecToType } from '../../../types/mapper';
import { routeStore } from '../storeFactory';

export type routeCallback<Spec extends RouteParamsSpec, props> = (params: SpecToType<Spec>, props: props) => ApplicationElement;

// tslint:disable-next-line:space-before-function-paren
function componentFactory<Spec extends RouteParamsSpec, componentProps extends Partial<props>>
(routeStore: routeStore<Spec>, callback: routeCallback<Spec, componentProps>) {
  return class RouterComponent extends Component<componentProps>{
    render(Props: Props<componentProps>) {
      return <Props render={props =>
        <routeStore.Observer render={(routeState) => {
          if (routeState.active === true) {
            return callback(routeState.parameter, props);
          }
          return null;
        }} />
      } />;
    }
  };
}
export default componentFactory;
