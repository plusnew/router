import { RouteParamsSpec } from '../../types/mapper';
import componentFactory, { RouteComponet } from './componentFactory';
import linkFactory from './linkFactory';

export default function <
  spec extends RouteParamsSpec,
  componentProps
>(namespace: string, spec: spec, RouteComponet: RouteComponet<spec, componentProps>) {
  return {
    Component: componentFactory(namespace, spec, RouteComponet),
    Link: linkFactory(namespace, spec),
    // Consumer: consumerFactory(namespace, spec),
  };
}
