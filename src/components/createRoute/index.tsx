import { RouteParamsSpec } from '../../types/mapper';
import componentFactory, { RouteComponet } from './componentFactory';
import linkFactory from './linkFactory';
import consumerFactory from './consumerFactory';

export default function <
  spec extends RouteParamsSpec,
  componentProps
>(namespaces: string[], spec: spec, RouteComponet: RouteComponet<spec, componentProps>) {
  const [mainNamespace] = namespaces;
  return {
    Component: componentFactory(namespaces, spec, RouteComponet),
    Link: linkFactory(mainNamespace, spec),
    Consumer: consumerFactory(namespaces, spec),
  };
}
