# plusnew-router [![Build Status](https://api.travis-ci.org/plusnew/plusnew-router.svg?branch=master)](https://travis-ci.org/plusnew/plusnew-router) [![Coverage Status](https://coveralls.io/repos/github/plusnew/plusnew-router/badge.svg?branch=master)](https://coveralls.io/github/plusnew/plusnew-router)

This library is for typesafe is made for routing with plusnew

```ts
import plusnew, { Component } from 'plusnew';
import Router, { DomDriver } from '@plusnew/router';

const router = new Router(new DomDriver());

const route = router.createRoute('namespace', {
  oneParameter: 'string',
  anotherParameter: 'number',
}, ({ oneParameter, anotherParameter }) => {
  return <span>{oneParameter} {anotherParameter}</span>;
});

export default class MainComponent extends Component<{}> {
  render() {
    return (
      <>
        <route.Link parameter={{ oneParameter: 'value', anotherParameter: 2 }}>LinkText</route.Link>

        <route.Component />

        <router.NotFound>No matching route found</router.NotFound>
        <router.Invalid>A matching route was found, but it has invalid parameters</router.Invalid>
      </>
    );
  }
```
