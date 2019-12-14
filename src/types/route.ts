import { parameterSpecTemplate, routeContainerToType } from './mapper';
import { ComponentContainer } from '@plusnew/core';

export type routeContainer<
  namespace extends string,
  parameterSpec extends parameterSpecTemplate,
  parentParameter extends {},
> = {
  namespace: string,
  parameterSpec: parameterSpec,
  component: ComponentContainer<{ parameter: routeContainerToType<namespace, parameterSpec> & parentParameter }>;
};
