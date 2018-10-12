# plusnew-router [![Build Status](https://api.travis-ci.org/plusnew/plusnew-router.svg?branch=master)](https://travis-ci.org/plusnew/plusnew-router) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew-router/badge.svg?branch=master)](https://coveralls.io/github/plusnew/plusnew-router)

This library is for typesafe is made for routing with plusnew

```ts
import plusnew, { Component } from 'plusnew';
import Router, { DomDriver } from '@plusnew/router';

// This domdriver changes the urls and listens for url changes
const domDriver = new DomDriver();

// create a new router instance for handling your routes, you can have multiple if needed
const router = new Router(domDriver);

const route = router.createRoute(
  // With that namespace, the path will begin
  'namespace',

  // This parameter describes what parameters are needed for the route
  // and what types they have, allowed are: string, number, boolean, date
  {
    oneParameter: 'string',
    anotherParameter: 'number',
  },
  // This callback will be called, when the path is matching the namespace and the parameters
  // the first given argument, is from the path and are correctly typed
  ({ oneParameter, anotherParameter }) => {

    // the return value will be displayed wherever you put <route.Component />
    return <span>{oneParameter} {anotherParameter}</span>;
  },
);

export default class MainComponent extends Component<{}> {
  render() {
    return (
      <>
        {/*This will create an a-tag with href /namespace/oneParameter/value/anotherParameter/2/ */}
        <route.Link parameter={{ oneParameter: 'value', anotherParameter: 2 }}>LinkText</route.Link>

        {/* in case the current path is matching, the return-value of the route-callback with the span will be here*/}
        <route.Component />

        {/* in case the current path does not match any existing routes, the children of NotFound will be displayed */}
        <router.NotFound>No matching route found</router.NotFound>

        {/* in case the path matched the namespace of a route, but the parameters were not correct the children of Invalid will be display */}
        <router.Invalid>A matching route was found, but it has invalid parameters</router.Invalid>
      </>
    );
  }
```
