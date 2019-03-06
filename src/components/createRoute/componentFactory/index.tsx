import plusnew, { Component, Props, ComponentContainer } from 'plusnew';
import { RouteParamsSpec, SpecToType } from '../../../types/mapper';
import url from '../../../contexts/url';
import link from '../../../contexts/link';

export type RouteComponet<Spec extends RouteParamsSpec, props> = ComponentContainer<{props: props, parameter: SpecToType<Spec>}>

export default function <
  params extends RouteParamsSpec,
  componentProps
>(namespace: string, params: params, RouteComponent: RouteComponet<params, componentProps>) {
  return class RouterComponent extends Component<componentProps>{
    render(Props: Props<componentProps>) {
      return (
        <link.Consumer>{linkState =>
          <Props>{propsState =>
            <url.Consumer>{urlState =>
              linkState.isNamespaceActive(namespace, urlState) ?
                <RouteComponent
                  parameter={linkState.parseLink(namespace, params, urlState)}
                  props={propsState}
                />
                :
                null
            }</url.Consumer>
          }</Props>
        }</link.Consumer>
      );
    }
  };
}