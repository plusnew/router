import plusnew, { Component, Props, ComponentContainer } from 'plusnew';
import { RouteParamsSpec, SpecToType } from '../../../types/mapper';
import url from '../../../contexts/url';
import urlHandler from '../../../contexts/urlHandler';

export type RouteComponet<Spec extends RouteParamsSpec, props> = ComponentContainer<{props: props, parameter: SpecToType<Spec>}>;

export default function <
  params extends RouteParamsSpec,
  componentProps
>(namespace: string, params: params, RouteComponent: RouteComponet<params, componentProps>) {
  return class RouterComponent extends Component<componentProps>{
    render(Props: Props<componentProps>) {
      return (
        <urlHandler.Consumer>{linkState =>
          <Props>{propsState =>
            <url.Consumer>{urlState =>
              linkState.isNamespaceActive(namespace, urlState) ?
                <RouteComponent
                  parameter={linkState.parseUrl(namespace, params, urlState)}
                  props={propsState}
                />
                :
                null
            }</url.Consumer>
          }</Props>
        }</urlHandler.Consumer>
      );
    }
  };
}
