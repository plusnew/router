import plusnew, { ApplicationElement, Component, Props } from '@plusnew/core';
import { routeContainer } from '../../../types/route';

type props<parameter> = {
  children: ApplicationElement,
  parameter: parameter,
};

export default function <parameter>(routeChain: routeContainer<any, any, parameter>[]) {
  return class Link extends Component<props<parameter>> {
    static displayName = 'RouteLink';
    render(Props: Props<props<parameter>>) {
      return (
        <Props>{props =>
          null
        }</Props>
      );
    }
  };
}
