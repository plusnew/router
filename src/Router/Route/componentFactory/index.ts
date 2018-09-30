import { ApplicationElement, Component } from 'plusnew';
import { props } from 'plusnew/dist/src/interfaces/component';
import Router from '../..';
import { RouteParamsSpec, SpecToType } from '../../../types/mapper';

export type routeCallback<params extends RouteParamsSpec, props> = (params: SpecToType<params>, props: props) => ApplicationElement;

// tslint:disable-next-line:space-before-function-paren
function componentFactory<params extends RouteParamsSpec, componentProps extends Partial<props>>
(router: Router, namespace: string, params: params, callback: routeCallback<params, componentProps>) {
  return class RouterComponent extends Component<{}>{
    render() {
      return null;
    }
  };
}
export default componentFactory;
