import plusnew, { Component, Props, ComponentContainer, Instance } from 'plusnew';
import { RouteParamsSpec, SpecToType } from '../../../types/mapper';
import url from '../../../contexts/url';
import urlHandler from '../../../contexts/urlHandler';

export type RouteComponet<Spec extends RouteParamsSpec, props> = ComponentContainer<{props: props, parameter: SpecToType<Spec>}>;

export default function <
  params extends RouteParamsSpec,
  componentProps
>(namespaces: string[], params: params, RouteComponent: RouteComponet<params, componentProps>) {
  return class RouterComponent extends Component<componentProps>{

    render(Props: Props<componentProps>, componentInstance: Instance) {
      return (
        <urlHandler.Consumer>{linkState =>
          <Props>{propsState =>
            <url.Consumer>{(urlState) => {
              const activeNamespace = namespaces.find(namespace => linkState.isNamespaceActive(namespace, urlState));

              if (activeNamespace === undefined) {
                return false;
              }

              return (
                <RouteComponent
                  parameter={linkState.parseUrl(activeNamespace, params, urlState)}
                  props={propsState}
                />
              );
            }}</url.Consumer>
          }</Props>
        }</urlHandler.Consumer>
      );
    }
  };
}
