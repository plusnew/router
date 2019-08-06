import plusnew, { Component, Props, ApplicationElement } from '@plusnew/core';
import urlHandler from '../../../contexts/urlHandler';
import url from '../../../contexts/url';
import { RouteParamsSpec, SpecToType } from '../../../types/mapper';

type renderProps<params extends RouteParamsSpec> =
  (state: { active: false } | { active: true, parameter: SpecToType<params> }) => ApplicationElement;

type props<params extends RouteParamsSpec> = {
  children: renderProps<params>;
};

export default function <
  spec extends RouteParamsSpec,
  >(namespaces: string[], spec: spec) {
  return class RouteConsumer extends Component<props<spec>>{
    static displayName = 'RouteConsumer';
    render(Props: Props<props<spec>>) {
      return (
        <urlHandler.Consumer>{urlHandlerState =>
          <Props>{propsState =>
            <url.Consumer>{(urlState) => {
              const [renderProps]: [renderProps<spec>] = propsState.children as any;

              const activeNamespace = namespaces.find(namespace =>
                urlHandlerState.isNamespaceActive(namespace, urlState),
              );

              if (activeNamespace !== undefined) {
                try {
                  const parameter = urlHandlerState.parseUrl(activeNamespace, spec, urlState);

                  return renderProps({
                    parameter,
                    active: true,
                  });
                } catch (error) {

                }
              }

              return renderProps({
                active: false,
              });
            }}</url.Consumer>
          }</Props>
        }</urlHandler.Consumer>
      );
    }
  };
}
