# plusnew-router [![Build Status](https://api.travis-ci.org/plusnew/router.svg?branch=master)](https://travis-ci.org/plusnew/router) [![Coverage Status](https://coveralls.io/repos/github/plusnew/router/badge.svg?branch=master)](https://coveralls.io/github/plusnew/router)

This router makes complete typesafety possible.
At compile and runtime the typesafety is guaranteed, for the Route-Components and also the Links.

```ts
import plusnew, { component } from '@plusnew/core';
import { createRoute, Invalid, NotFound, serializer } from '@plusnew/router';

const route = createRoute(
  // With the paths the route will be responsible for
  'routeName',

  // Defines what parameter the route can have
  {
    oneParameter: [serializer.number()], // This parameter is required and a normal number
    optionalParameter: [serializer.undefined(), serializer.boolean()], // Optional boolean parameter
    sortOrder: [serializer.string('asc'), serializer.string('desc'), serializer.undefined()], // This paramter is optional, when given it has to be the string literal 'asc' | 'desc'
  } as const,

  // This Component will be shown, when the path is matching the routeName and the parameters
  component(
  'RouteComponent',
    Props =>
      <Props>{props =>
        <>
          <span>{props.parameter.routeName.oneParameter}</span>

          {/** Typescript is aware, that parameter.sortOrder has this type: 'asc' | 'desc' | undefined */}
          {props.parameter.routeName.sortOrder && <span>{props.parameter.routeName.sortOrder}</span>}
        </>
      }</Props>,
  ),
);

const MainComponent = component(
  'MainComponent',
  () =>
    <>
      {/*This will create an a-tag with href /routeName?oneParameter=1&sortOrder=asc
      the typescript compiler will complain, in case the types defined as parameterSpecification are not matched
      */}
      <route.Link parameter={{
        routeName: {
          oneParameter: 1,
          sortOrder: 'asc',
        },
      }}>LinkText</route.Link>

      {/* in case the current path is matching, the RouteComponent with the span will be displayed here*/}
      <route.Component />

      {/* in case the current path does not match any existing routes, the children of NotFound will be displayed */}
      <NotFound>No matching route found</NotFound>

      {/* in case the path matched the namespace of a route, but the parameters were not correct the children of Invalid will be display */}
      <Invalid>Route found, but with invalid parameter</Invalid>
    </>,
);
```
