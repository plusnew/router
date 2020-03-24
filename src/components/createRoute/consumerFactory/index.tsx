import plusnew, { ApplicationElement, Component, Props } from '@plusnew/core';
import type ComponentInstance from '@plusnew/core/src/instances/types/Component/Instance';
import url from '../../../contexts/url';
import urlHandler, { routeState } from '../../../contexts/urlHandler';
import type { parameterSpecTemplate, parameterSpecToType } from '../../../types/mapper';
import type { routeContainer } from '../../../types/route';

type inactive = { isActive: false, isActiveAsParent: false, invalid: false };
type active<parameter> = { isActive: true, isActiveAsParent: false, parameter: parameter, invalid: false };
type activeAsParent<parameter> = { isActive: false, isActiveAsParent: true, parameter: parameter, invalid: false };
type invalid = { isActive: false, isActiveAsParent: false, invalid: true };

type props<parameter> = {
  children: (
    state: inactive | active<parameter> | activeAsParent<parameter> | invalid,
    redirect: (opt: {parameter: parameter}) => void,
  ) => ApplicationElement;
};

export default function <
  routeName extends string,
  parameterSpec extends parameterSpecTemplate,
  parentParameter
>(routeChain: routeContainer<routeName, parameterSpec, parentParameter>[]) {
  type parameter = parentParameter & parameterSpecToType<parameterSpec>;
  return class Link extends Component<props<parameter>> {
    static displayName = 'RouteConsumer';
    render(Props: Props<props<parameter>>, componentInstance: ComponentInstance<any, any, any>) {
      const redirect = (opt: { parameter: parameter }) => {
        const newUrl = urlHandler.findProvider(componentInstance).state.createUrl(
          routeChain,
          opt.parameter,
        );

        url.findProvider(componentInstance).dispatch(newUrl);
      };

      return (
        <url.Consumer>{urlState =>
          <urlHandler.Consumer>{(urlHandlerState) => {
            const currentRouteState = urlHandlerState.getRouteState(routeChain, urlState);
            if (currentRouteState === routeState.inactive) {
              return (
                <Props>{props =>
                  (((props.children as any)[0]) as props<parameter>['children'])({
                    isActive: false,
                    isActiveAsParent: false,
                    invalid: false,
                  }, redirect)
                }</Props>
              );
            }

            // Active
            try {
              const parameter = urlHandlerState.getParameter<
                routeName,
                parameterSpec,
                parentParameter>(routeChain, urlState);

              return (
                <Props>{props =>
                  (((props.children as any)[0]) as props<parameter>['children'])({
                    parameter,
                    isActive: currentRouteState === routeState.active,
                    isActiveAsParent: currentRouteState === routeState.activeAsParent,
                    invalid: false,
                  } as inactive | active<parameter> | activeAsParent<parameter>, redirect)
                }</Props>
              );
            } catch (error) {

              // Active but invalid
              return (
                <Props>{props =>
                  (((props.children as any)[0]) as props<parameter>['children'])({
                    isActive: false,
                    isActiveAsParent: false,
                    invalid: true,
                  }, redirect)
                }</Props>
              );
            }
          }}</urlHandler.Consumer>
        }</url.Consumer>
      );
    }
  };
}
