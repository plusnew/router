import { context } from '@plusnew/core';
import { routeContainer } from 'types/route';

export type linkHandler = {
  isNamespaceActive: (routeChain: routeContainer<any, any, any>[], url: string) => boolean;
  createUrl: (routeChain: routeContainer<any, any, any>[], parameter: any) => string;
  parseUrl: <parameter>(routeChain: routeContainer<any, any, any>[], url: string) => parameter,
};

export default context<linkHandler, never>();
