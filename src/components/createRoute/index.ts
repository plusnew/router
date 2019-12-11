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
  const Link: ComponentContainer<{children: any, parameter: parentParameter }> = undefined as any;
  const Consumer = undefined;

  function createChildRoute<
    routeName extends string,
    parameterSpec extends parameterSpecTemplate,
    >(
      routeName: routeName,
      parameterSpec: parameterSpec,
      component: ComponentContainer<{ parameter: parentParameter & routeContainerToType<routeName, parameterSpec> }>) {
    return abstractCreateRoute<parentParameter & routeContainerToType<routeName, parameterSpec>>([...routeChain, {
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
