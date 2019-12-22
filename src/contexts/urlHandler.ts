import { context } from '@plusnew/core';
import { parameterSpecToType, parameterSpecTemplate } from 'types/mapper';
import { routeContainer } from 'types/route';

export type linkHandler = {
  isNamespaceActive: (routeChain: routeContainer<any, any, any>[], url: string) => boolean;
  createUrl: (routeChain: routeContainer<any, any, any>[], parameter: any) => string;
  parseUrl:<
  parameterSpec extends parameterSpecTemplate,
  parentParameter
>(routeChain: routeContainer<any, parameterSpec, parentParameter>[], url: string) => parameterSpecToType<parameterSpec> & parentParameter,
};

export default context<linkHandler, never>();
