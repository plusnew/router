import plusnew, { Component, Props, ApplicationElement } from '@plusnew/core';
import urlHandler from '../../../contexts/urlHandler';
import url from '../../../contexts/url';
import { RouteParameterSpec, SpecToType } from '../../../types/mapper';
import ComponentInstance from '@plusnew/core/dist/src/instances/types/Component/Instance';

type renderProps<params extends RouteParameterSpec> =
  (state: { active: false } | { active: true, parameter: SpecToType<params> }, redirect: (parameter: SpecToType<params>) => void) => ApplicationElement;

type props<params extends RouteParameterSpec> = {
  children: renderProps<params>;
};

export default function <
  spec extends RouteParameterSpec,
  >(namespace: string, spec: spec) {
  return class RouteConsumer extends Component<props<spec>>{
    static displayName = 'RouteConsumer';
    render(Props: Props<props<spec>>, componentInstance: ComponentInstance<any>) {
      const redirect = (parameter: SpecToType<spec>) => {
        const urlHandlerState = urlHandler.findProvider(componentInstance).props.state;
        const urlDispatch = url.findProvider(componentInstance).props.dispatch;

        const targetUrl = urlHandlerState.createUrl(namespace, spec, parameter);
        urlDispatch(targetUrl);
      };

      return (
        <urlHandler.Consumer>{urlHandlerState =>
          <Props>{propsState =>
            <url.Consumer>{(urlState) => {
              const [renderProps]: [renderProps<spec>] = propsState.children as any;

              const activeNamespace = urlHandlerState.isNamespaceActive(namespace, urlState);

              if (activeNamespace) {
                try {
                  const parameter = urlHandlerState.parseUrl(namespace, spec, urlState);

                  return renderProps({
                    parameter,
                    active: true,
                  }, redirect);
                } catch (error) {

                }
              }

              return renderProps({
                active: false,
              }, redirect);
            }}</url.Consumer>
          }</Props>
        }</urlHandler.Consumer>
      );
    }
  };
}
