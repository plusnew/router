import type { ComponentContainer } from "@plusnew/core";
import type {
  parameterSpecTemplate,
  routeContainerToType,
} from "../../types/mapper";
import type { routeContainer } from "../../types/route";
import componentFactory from "./componentFactory";
import consumerFactory from "./consumerFactory";
import linkFactory from "./linkFactory";

function abstractCreateRoute<parentParameter>(
  routeChain: routeContainer<any, any, parentParameter>[]
) {
  function createChildRoute<
    routeName extends string,
    parameterSpec extends parameterSpecTemplate
  >(
    routeName: routeName,
    parameterSpec: parameterSpec,
    component: ComponentContainer<
      {
        parameter: parentParameter &
          routeContainerToType<routeName, parameterSpec>;
      },
      any,
      any
    >
  ) {
    return abstractCreateRoute<
      parentParameter & routeContainerToType<routeName, parameterSpec>
    >([
      ...routeChain,
      {
        routeName,
        parameterSpec,
        component,
      },
    ]);
  }

  return {
    createChildRoute,
    Component: componentFactory(routeChain),
    Link: linkFactory(routeChain),
    Consumer: consumerFactory(routeChain),
  };
}

export default function createRoute<
  routeName extends string,
  parameterSpec extends parameterSpecTemplate
>(
  routeName: routeName,
  parameterSpec: parameterSpec,
  component: ComponentContainer<
    { parameter: routeContainerToType<routeName, parameterSpec> },
    any,
    any
  >
) {
  return abstractCreateRoute<routeContainerToType<routeName, parameterSpec>>([
    {
      routeName,
      parameterSpec,
      component,
    },
  ]);
}
