import { ComponentContainer } from '@plusnew/core';
import { parameterSpecTemplate, routeContainerToType } from '../../types/mapper';
import { routeContainer } from '../../types/route';
import componentFactory from './componentFactory';
import consumerFactory from './consumerFactory';
import linkFactory from './linkFactory';

export default function createRoute<
  namespace extends string,
  parameterSpec extends parameterSpecTemplate,
  >(
    namespace: namespace,
    parameterSpec: parameterSpec,
    component: ComponentContainer<{ parameter: routeContainerToType<namespace, parameterSpec> }>) {
  return abstractCreateRoute<routeContainerToType<namespace, parameterSpec>>([{
    namespace,
    parameterSpec,
    component,
  }]);
}

function abstractCreateRoute<
  parentParameter,
>(routeChain: routeContainer<any, any, parentParameter>[]) {
  function createChildRoute<
    namespace extends string,
    parameterSpec extends parameterSpecTemplate,
    >(
      namespace: namespace,
      parameterSpec: parameterSpec,
      component: ComponentContainer<{ parameter: parentParameter & routeContainerToType<namespace, parameterSpec> }>) {
    return abstractCreateRoute<parentParameter & routeContainerToType<namespace, parameterSpec>>([...routeChain, {
      namespace,
      parameterSpec,
      component,
    }]);
  }

  return {
    createChildRoute,
    Component: componentFactory(routeChain),
    Link: linkFactory(routeChain),
    Consumer: consumerFactory(routeChain),
  };
}
