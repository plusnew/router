import type { Props } from "@plusnew/core";
import plusnew, { component, context } from "@plusnew/core";

const contextResult = context<string, string>();

function hasModifier(evt: MouseEvent) {
  return (
    evt.altKey === true ||
    evt.ctrlKey === true ||
    evt.shiftKey === true ||
    evt.metaKey === true
  );
}

function findLink(element: HTMLElement): URL | null {
  if (element.tagName === "A") {
    return new URL((element as HTMLAnchorElement).href);
  } else if (element.parentElement) {
    return findLink(element.parentElement);
  } else {
    return null;
  }
}

const result = {
  Consumer: contextResult.Consumer,
  findProvider: contextResult.findProvider,
  Provider: component(
    "RouteProvider",
    (
      Props: Props<{
        state: string;
        dispatch: (action: string) => boolean;
        children: any;
      }>,
      componentInstance
    ) => {
      const selfUrl = new URL(location.href);
      const eventListener = (evt: MouseEvent) => {
        const link = findLink(evt.target as HTMLElement);

        if (hasModifier(evt) === false && link !== null) {
          if (
            selfUrl.origin === link.origin &&
            Props.getState().dispatch(link.pathname)
          ) {
            evt.preventDefault();
          }
        }
      };
      const rootElement = componentInstance.renderOptions.driver.getRootElement(
        null as any
      ) as HTMLElement;
      componentInstance.registerLifecycleHook("componentDidMount", () =>
        rootElement.addEventListener("click", eventListener)
      );
      componentInstance.registerLifecycleHook("componentWillUnmount", () =>
        rootElement.removeEventListener("click", eventListener)
      );

      return (
        <Props>
          {(props) => (
            <contextResult.Provider
              state={props.state}
              dispatch={props.dispatch}
            >
              {props.children}
            </contextResult.Provider>
          )}
        </Props>
      );
    }
  ),
};

export default result;
