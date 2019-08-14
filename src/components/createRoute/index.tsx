import { RouteParameterSpec } from '../../types/mapper';
import componentFactory, { RouteComponent } from './componentFactory';
import linkFactory from './linkFactory';
import consumerFactory from './consumerFactory';

export default function <
  spec extends RouteParameterSpec,
  componentProps
>(namespaces: string[], spec: spec, RouteComponent: RouteComponent<spec, componentProps>) {
  const [mainNamespace] = namespaces;
  return {
    Component: componentFactory(namespaces, spec, RouteComponent),
    Link: linkFactory(mainNamespace, spec),
    Consumer: consumerFactory(namespaces, spec),
  };
}
