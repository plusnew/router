import { ComponentContainer } from '@plusnew/core';
import { parameterSpecTemplate, routeContainerToType } from './mapper';

export type routeContainer<
  namespace extends string,
  parameterSpec extends parameterSpecTemplate,
  parentParameter extends {},
> = {
  namespace: string,
  parameterSpec: parameterSpec,
  component: ComponentContainer<{ parameter: routeContainerToType<namespace, parameterSpec> & parentParameter }>;
};
