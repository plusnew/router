import { RouteParameterSpec } from '../../types/mapper';
import componentFactory, { RouteComponent } from './componentFactory';
import linkFactory from './linkFactory';
import consumerFactory from './consumerFactory';

export default function <
  spec extends RouteParameterSpec,
  componentProps
>(namespace: string, spec: spec, RouteComponent: RouteComponent<spec, componentProps>) {
  return {
    Component: componentFactory(namespace, spec, RouteComponent),
    Link: linkFactory(namespace, spec),
    Consumer: consumerFactory(namespace, spec),
  };
}
