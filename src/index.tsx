import plusnew, { component } from 'plusnew';
import { RouteParamsSpec, SpecToType } from './types';
import urlFactory from './buildUrl';
import store from './store';
import { getUrlParts, getCurrentParams, isCurrentNamspace } from './params';

export default function <Spec extends RouteParamsSpec>(namespace: string, spec: Spec, componentBuilder: (params: SpecToType<Spec>) => plusnew.JSX.Element) {
  const buildUrl = urlFactory(namespace, spec);
  const Link = component(
    'Link',
    () => ({}),
    (props: SpecToType<Spec>) => <a href={buildUrl(props)} onclick={() => {
      store.dispatch({
        type: 'push',
        url: buildUrl(props),
      });
    }}/>,
  );

  const Component = component(
    'ComponentRoute',
    () => ({ store }),
    () => {
      const urlParts = getUrlParts(store.state);
      if (isCurrentNamspace(namespace, urlParts)) {
        const params = getCurrentParams(spec, urlParts);
        return componentBuilder(params);
      }
      return null;
    },
  );

  return {
    Link,
    Component,
    buildUrl,
  };
}
