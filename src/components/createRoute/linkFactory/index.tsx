import plusnew, { ApplicationElement, Component, Props } from '@plusnew/core';
import { routeContainer } from '../../../types/route';
import { parameterSpecTemplate, routeContainerToType } from '../../../types/mapper';
import urlHandler from '../../../contexts/urlHandler';
import url from '../../../contexts/url';

type props<parameter> = {
  children: ApplicationElement[],
  parameter: parameter,
};

export default function <
  routeName extends string,
  parameterSpec extends parameterSpecTemplate,
  parentParameter
>(routeChain: routeContainer<routeName, parameterSpec, parentParameter>[]) {
  type parameter = routeContainerToType<routeName, parameterSpec> & parentParameter;

  return class Link extends Component<props<parameter>> {
    static displayName = 'RouteLink';
    render(Props: Props<props<parameter>>) {
      return (
        <urlHandler.Consumer>{urlHandlerState =>
          <url.Consumer>{(urlState, dispatch) =>
            <Props>{(props) => {
              const targetUrl = urlHandlerState.createUrl(routeChain, props.parameter);

              return plusnew.createElement('a', {
                href: targetUrl,
                onclick: () => {
                  dispatch(targetUrl);
                },
              }, ...props.children);
            }
            }</Props>
          }</url.Consumer>
        }</urlHandler.Consumer>
      );
    }
  };
}
