import plusnew, { Component, Props } from '@plusnew/core';
import url from 'contexts/url';
import urlHandler from 'contexts/urlHandler';
import { parameterSpecTemplate } from 'types/mapper';
import { routeContainer } from 'types/route';

export default function <
  namespace extends string,
  parameterSpec extends parameterSpecTemplate,
  parentParameter
>(routeChain: routeContainer<namespace, parameterSpec, parentParameter>[]) {
  return class Link extends Component<{}> {
    static displayName = 'RouteComponent';
    render(_Props: Props<{}>) {
      return (
        <url.Consumer>{urlState =>
          <urlHandler.Consumer>{(urlHandlerState) => {
            if (urlHandlerState.isNamespaceActive(routeChain, urlState)) {
              try {
                const parameter = urlHandlerState.parseUrl<
                  namespace,
                  parameterSpec,
                  parentParameter>(routeChain, urlState);
                const route = routeChain[routeChain.length - 1];

                return <route.component parameter={parameter} />;
              } catch (error) {

              }
            }

            return null;
          }}</urlHandler.Consumer>
        }</url.Consumer>
      );
    }
  };
}
