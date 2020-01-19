# plusnew-router [![Build Status](https://api.travis-ci.org/plusnew/router.svg?branch=master)](https://travis-ci.org/plusnew/router) [![Coverage Status](https://coveralls.io/repos/github/plusnew/router/badge.svg?branch=master)](https://coveralls.io/github/plusnew/router)

This router makes complete typesafety possible.
At compile and runtime the typesafety is guaranteed, for the Route-Components and also the Links.

```ts
import plusnew, { component } from '@plusnew/core';
import { createRoute, Invalid, NotFound, serializer } from '.';

const rootRoute = createRoute(
  // With the paths the route will be responsible for
  'rootRouteName',

  // Defines what parameter the route can have
  {
    oneParameter: [serializer.number()], // This parameter is required and a normal number
    sortOrder: [serializer.string('asc'), serializer.string('desc'), serializer.undefined()], // This paramter is optional, when given it has to be the string literal 'asc' | 'desc'
  } as const,

  // This Component will be shown, when the path is matching the routeName and the parameters
  component(
    'RootRouteComponent',
    Props =>
      <Props>{props =>
        <>
          <span>{props.parameter.rootRouteName.oneParameter}</span>

          {/** Typescript is aware, that parameter.sortOrder has this type: 'asc' | 'desc' | undefined */}
          {props.parameter.rootRouteName.sortOrder && <span>{props.parameter.rootRouteName.sortOrder}</span>}
        </>
      }</Props>,
  ),
);

const childRoute = rootRoute.createChildRoute(
  'childRouteName',
  {
    optionalParameter: [serializer.undefined(), serializer.boolean()], // Optional boolean parameter
  } as const,
  component(
    'ChildRouteComponent',
    Props =>
      <Props>{props =>
        <>
          {/* compiler knows that optional parameter is either boolean or undefined */}
          <div>{props.parameter.childRouteName.optionalParameter}</div>

          {/* Child routes have parent parameters are also available */}
          <div>{props.parameter.rootRouteName.oneParameter}</div>

        </>
      }</Props>,
  ),
);

const MainComponent = component(
  'MainComponent',
  () =>
    <>
      {/*This will create an a-tag with href /rootRouteName;oneParameter=1&sortOrder=asc
      the typescript compiler will complain, in case the types defined as parameterSpecification are not matched
      */}
      <rootRoute.Link parameter={{
        rootRouteName: {
          oneParameter: 1,
          sortOrder: 'asc',
        },
      }}>LinkText to root</rootRoute.Link>

      {/*This will create an a-tag with href /rootRouteName;oneParameter=2&sortOrder=desc/childRouteName;optionalParameter=true
      the typescript compiler will complain, in case the types defined as parameterSpecification are not matched
      */}
      <childRoute.Link parameter={{
        rootRouteName: {
          oneParameter: 2,
          sortOrder: 'desc',
        },
        childRouteName: {
          optionalParameter: true,
        },
      }}>LinkText to child</childRoute.Link>

      {/* in case the current path is matching, the RouteComponent with the span's will be displayed here*/}
      <rootRoute.Component />

      {/* in case the current path is matching, the RouteComponent with the span's will be displayed here*/}
      <childRoute.Component />

      {/* in case the current path does not match any existing routes, the children of NotFound will be displayed */}
      <NotFound>No matching route found</NotFound>

      {/* in case the path matched the namespace of a route, but the parameters were not correct the children of Invalid will be display */}
      <Invalid>Route found, but with invalid parameter</Invalid>
    </>,
);
```
