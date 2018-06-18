import { RouteParamsSpec, SpecToType } from './types';
import buildUrl from './buildUrl';
import plusnew, { component } from 'plusnew';

export default function <Params extends RouteParamsSpec>(namespace: string, parameters: Params, componentBuilder: (params: SpecToType<Params>) => plusnew.JSX.Element) {
  const Link = component(
   'Link',
   () => ({}),
   (props: SpecToType<Params>) => <a href={buildUrl(props)}/>,
  );

  const Component = component(
    'Link',
    () => ({}),
    () => null
   );

  return {
    Link,
    Component,
    buildUrl: <Params extends RouteParamsSpec>(params: SpecToType<Params>) => buildUrl(params),
  };
}
