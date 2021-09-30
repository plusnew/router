import plusnew, { ApplicationElement, Component, Props } from "@plusnew/core";
import url from "../../../contexts/url";
import urlHandler, { routeState } from "../../../contexts/urlHandler";
import type {
  parameterSpecTemplate,
  routeContainerToType,
} from "../../../types/mapper";
import type { routeContainer } from "../../../types/route";

type props<parameter> = {
  children: ApplicationElement;
  parameter: parameter;
  class?: string;
  classActive?: string;
  onclick?: () => void;
};

function hasModifier(evt: MouseEvent) {
  return (
    evt.altKey === true ||
    evt.ctrlKey === true ||
    evt.shiftKey === true ||
    evt.metaKey === true
  );
}

export default function <
  routeName extends string,
  parameterSpec extends parameterSpecTemplate,
  parentParameter
>(routeChain: routeContainer<routeName, parameterSpec, parentParameter>[]) {
  type parameter = routeContainerToType<routeName, parameterSpec> &
    parentParameter;

  return class Link extends Component<props<parameter>> {
    static displayName = "RouteLink";
    render(Props: Props<props<parameter>>) {
      return (
        <urlHandler.Consumer>
          {(urlHandlerState) => (
            <url.Consumer>
              {(urlState, dispatch) => (
                <Props>
                  {(props) => {
                    const targetUrl = urlHandlerState.createUrl(
                      routeChain,
                      props.parameter
                    );

                    const currentRouteState = urlHandlerState.getRouteState(
                      routeChain,
                      urlState
                    );

                    const classes: string[] = [];

                    if (props.class) {
                      classes.push(props.class);
                    }

                    if (
                      currentRouteState === routeState.active &&
                      props.classActive
                    ) {
                      classes.push(props.classActive);
                    }

                    return plusnew.createElement(
                      "a" as any,
                      {
                        class: classes.join(" ") || null,
                        href: targetUrl,
                        onclick: (evt: MouseEvent) => {
                          if (hasModifier(evt) === false) {
                            dispatch(targetUrl);
                            evt.preventDefault();
                            if (props.onclick) {
                              props.onclick();
                            }
                          }
                        },
                      },
                      ...(props.children as any)
                    );
                  }}
                </Props>
              )}
            </url.Consumer>
          )}
        </urlHandler.Consumer>
      );
    }
  };
}
