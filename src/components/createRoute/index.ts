import { ComponentContainer } from '@plusnew/core';
import { parameterSpecTemplate, routeContainerToType } from '../../types/mapper';

export default function createRoute<
  routeName extends string,
  parameterSpec extends parameterSpecTemplate,
  >(
    routeName: routeName,
    parameterSpec: parameterSpec,
    component: ComponentContainer<{ parameter: routeContainerToType<routeName, parameterSpec> }>) {
  return abstractCreateRoute<routeContainerToType<routeName, parameterSpec>>([{
    routeName,
    parameterSpec,
    component,
  }]);
}

function abstractCreateRoute<
  parentParameter,
  >(routeChain: any[]) {
  const Component: ComponentContainer<{}> = undefined as any;
  const Link = undefined;
  const Consumer = undefined;

  function createChildRoute<
    routeName extends string,
    parameterSpec extends parameterSpecTemplate,
    >(
      routeName: routeName,
      parameterSpec: parameterSpec,
      component: ComponentContainer<{ parameter: parentParameter & routeContainerToType<routeName, parameterSpec> }>) {
    return abstractCreateRoute<routeContainerToType<routeName, parameterSpec>>([{
      routeName,
      parameterSpec,
      component,
    }]);
  }

  return {
    Component,
    Link,
    Consumer,
    createChildRoute,
  };
}