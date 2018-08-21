import plusnew, { component, Props } from 'plusnew';
import { RouteParamsSpec, SpecToType } from './types';
import urlFactory from './buildUrl';
import store from './store';
import { getUrlParts, getCurrentParams, isCurrentNamspace } from './params';
import NoRoute, { hasRoute } from './NoRoute';
import { ApplicationElement } from 'plusnew/dist/src/interfaces/component';

export default function <Spec extends RouteParamsSpec>(namespace: string, spec: Spec, componentBuilder: (params: SpecToType<Spec>) => plusnew.JSX.Element) {
  const buildUrl = urlFactory(namespace, spec);
  const Link = component(
    'Link',
    (Props: Props<SpecToType<Spec> & { children: ApplicationElement[] }>) => 
      <Props render={props =>
        plusnew.createElement('a', {
          href: buildUrl(props),
          onclick: () => {
            store.dispatch({
              type: 'push',
              url: buildUrl(props),
            });
          },
        }, ...props.children)
      } />
  );

  const Component = component(
    'ComponentRoute',
    () =>
      <store.Observer render={state => {
        const urlParts = getUrlParts(state);
        if (isCurrentNamspace(namespace, urlParts)) {
          const params = getCurrentParams(spec, urlParts);
          hasRoute.dispatch(true);

          return componentBuilder(params);
        }
        return null;
      }} />
  );

  return {
    Link,
    Component,
    buildUrl,
  };
}

export { NoRoute }