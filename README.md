# plusnew-router [![Build Status](https://api.travis-ci.org/plusnew/plusnew-router.svg?branch=master)](https://travis-ci.org/plusnew/plusnew-router) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew-router/badge.svg?branch=master)](https://coveralls.io/github/plusnew/plusnew-router)

This library is for typesafe is made for routing with plusnew

```ts
import plusnew, { Component } from 'plusnew';
import { createRoute } from '@plusnew/router';

const route = createRoute(
  // With the paths the route will be responsible for
  [ 'namespace' ],

  // This parameter describes what parameters are needed for the route
  // and what types they have, allowed are: string, number, boolean, date
  {
    oneParameter: 'string',
    anotherParameter: 'number',
  },
  // This Component will be shown, when the path is matching the namespace and the parameters
  RouteComponent
);

type props = { parameter: { oneParameter: string, anotherParameter: number } };

class RouteComponent extends Component<props> {
  render(Props: Props<props>) {
    return (
      <Props>{parameter =>
        <span>{parameter.oneParameter}</span>
      }</Props>
    )
  }
}

export default class MainComponent extends Component<{}> {
  render() {
    return (
      <>
        {/*This will create an a-tag with href /namespace?oneParameter=value&anotherParameter=2 */}
        <route.Link parameter={{ oneParameter: 'value', anotherParameter: 2 }}>LinkText</route.Link>

        {/* in case the current path is matching, the RouteComponent with the span will be displayed here*/}
        <route.Component />

        {/* in case the current path does not match any existing routes, the children of NotFound will be displayed */}
        <router.NotFound>No matching route found</router.NotFound>

        {/* in case the path matched the namespace of a route, but the parameters were not correct the children of Invalid will be display */}
        <router.NotFound>No matching route found</router.NotFound>
      </>
    );
  }
```
