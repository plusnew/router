import { context } from '@plusnew/core';
import type { parameterSpecTemplate, routeContainerToType } from '../types/mapper';

type routeContainer<
  routeName extends string,
  parameterSpec extends parameterSpecTemplate,
> = {
  routeName: routeName,
  parameterSpec: parameterSpec,
};

export enum routeState {
  active,
  activeAsParent,
  inactive,
}

export type linkHandler = {
  getRouteState: (routeChain: routeContainer<any, any>[], url: string) => routeState;
  createUrl: <
    routeName extends string,
    parameterSpec extends parameterSpecTemplate,
    parentParameter,
  >(routeChain: routeContainer<any, parameterSpecTemplate>[], parameter: routeContainerToType<routeName, parameterSpec> & parentParameter) => string;
  getParameter:<
    routeName extends string,
    parameterSpec extends parameterSpecTemplate,
    parentParameter,
  >(routeChain: routeContainer<any, parameterSpecTemplate>[], url: string) => routeContainerToType<routeName, parameterSpec> & parentParameter,
};

export default context<linkHandler, never>();
