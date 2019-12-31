import { context } from '@plusnew/core';
import { parameterSpecTemplate, routeContainerToType } from 'types/mapper';

type routeContainer<
  namespace extends string,
  parameterSpec extends parameterSpecTemplate,
> = {
  namespace: string,
  parameterSpec: parameterSpec,
};

export type linkHandler = {
  isNamespaceActive: (routeChain: routeContainer<any, any>[], url: string) => boolean;
  createUrl: <
    namespace extends string,
    parameterSpec extends parameterSpecTemplate
  >(routeChain: routeContainer<namespace, parameterSpec>[], parameter: routeContainerToType<namespace, parameterSpec>) => string;
  parseUrl:<
    namespace extends string,
    parameterSpec extends parameterSpecTemplate,
    parentParameter
  >(routeChain: routeContainer<namespace, parameterSpec>[], url: string) => routeContainerToType<namespace, parameterSpec> & parentParameter,
};

export default context<linkHandler, never>();
