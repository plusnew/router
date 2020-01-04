import plusnew, { ApplicationElement, Component, Props } from '@plusnew/core';
import url from '../../../contexts/url';
import urlHandler from '../../../contexts/urlHandler';
import { parameterSpecTemplate, parameterSpecToType } from '../../../types/mapper';
import { routeContainer } from '../../../types/route';

type inactive = { isActive: false, isActiveAsParent: false };
type active<parameter> = { isActive: true, isActiveAsParent: false, parameter: parameter };
type activeAsParent<parameter> = { isActive: false, isActiveAsParent: true, parameter: parameter };

type props<parameter> = {
  children: (state: inactive | active<parameter> | activeAsParent<parameter>) => ApplicationElement;
};

export default function <
  namespace extends string,
  parameterSpec extends parameterSpecTemplate,
  parentParameter
>(routeChain: routeContainer<namespace, parameterSpec, parentParameter>[]) {
  return class Link extends Component<props<parentParameter & parameterSpecToType<parameterSpec>>> {
    static displayName = 'RouteConsumer';
    render(Props: Props<props<parentParameter & parameterSpecToType<parameterSpec>>>) {
      return (
        <url.Consumer>{urlState =>
          <urlHandler.Consumer>{(urlHandlerState) => {
            if (urlHandlerState.isNamespaceActive(routeChain, urlState) || urlHandlerState.isNamespaceActiveAsParent(routeChain, urlState)) {
              try {
                const parameter = urlHandlerState.parseUrl<
                  namespace,
                  parameterSpec,
                  parentParameter>(routeChain, urlState);

                return (
                  <Props>{props =>
                    ((props.children as any)[0])({
                      parameter,
                      isActive: urlHandlerState.isNamespaceActive(routeChain, urlState),
                      isActiveAsParent: urlHandlerState.isNamespaceActiveAsParent(routeChain, urlState),
                    })
                  }</Props>
                );
              } catch (error) {

              }
            }

            return (
              <Props>{props =>
                ((props.children as any)[0])({
                  isActive: false,
                  isActiveAsParent: false,
                })
              }</Props>
            );
          }}</urlHandler.Consumer>
        }</url.Consumer>
      );
    }
  };
}
