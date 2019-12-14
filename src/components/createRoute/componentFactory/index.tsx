import plusnew, { Component, Props } from '@plusnew/core';
import { routeContainer } from 'types/route';

export default function <parameter>(routeChain: routeContainer<any, any, parameter>[]) {
  return class Link extends Component<{}> {
    static displayName = 'RouteComponent';
    render(Props: Props<{}>) {
      return (
        <Props>{props =>
          null
        }</Props>
      );
    }
  };
}
