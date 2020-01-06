import { context } from '@plusnew/core';
import { parameterSpecTemplate, routeContainerToType } from '../types/mapper';

type routeContainer<
  namespace extends string,
  parameterSpec extends parameterSpecTemplate,
> = {
  namespace: string,
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
    namespace extends string,
    parameterSpec extends parameterSpecTemplate,
    parentParameter,
  >(routeChain: routeContainer<any, parameterSpecTemplate>[], parameter: routeContainerToType<namespace, parameterSpec> & parentParameter) => string;
  getParameter:<
    namespace extends string,
    parameterSpec extends parameterSpecTemplate,
    parentParameter,
  >(routeChain: routeContainer<any, parameterSpecTemplate>[], url: string) => routeContainerToType<namespace, parameterSpec> & parentParameter,
};

export default context<linkHandler, never>();
