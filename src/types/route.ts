import type { ComponentContainer } from "@plusnew/core";
import type { parameterSpecTemplate, routeContainerToType } from "./mapper";

export type routeContainer<
  routeName extends string,
  parameterSpec extends parameterSpecTemplate,
  parentParameter extends {}
> = {
  routeName: string;
  parameterSpec: parameterSpec;
  component: ComponentContainer<
    {
      parameter: routeContainerToType<routeName, parameterSpec> &
        parentParameter;
    },
    unknown,
    unknown
  >;
};
