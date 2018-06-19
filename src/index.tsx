import plusnew, { component } from 'plusnew';
import { RouteParamsSpec, SpecToType } from './types';
import urlFactory from './buildUrl';
import store from './store';

export default function <Spec extends RouteParamsSpec>(namespace: string, spec: Spec, componentBuilder: (params: SpecToType<Spec>) => plusnew.JSX.Element) {
  const buildUrl = urlFactory(namespace, spec);
  const Link = component(
    'Link',
    () => ({}),
    (props: SpecToType<Spec>) => <a href={buildUrl(props)} onclick={() => {
      store.dispatch(buildUrl(props));
    }}/>,
  );

  const Component = component(
    'ComponentRoute',
    () => ({}),
    () => null
   );

  return {
    Link,
    Component,
    buildUrl,
  };
}
