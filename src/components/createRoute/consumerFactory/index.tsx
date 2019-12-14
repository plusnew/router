import plusnew, { ApplicationElement, Component, Props } from '@plusnew/core';
import { routeContainer } from 'types/route';

type inactive = { isActive: false, isActiveAsParent: false };
type active<parameter> = { isActive: true, isActiveAsParent: false, parameter: parameter };
type activeAsParent<parameter> = { isActive: false, isActiveAsParent: true, parameter: parameter };

type props<parameter> = {
  children: (state: inactive | active<parameter> | activeAsParent<parameter>) => ApplicationElement;
};

export default function <parameter>(routeChain: routeContainer<any, any, parameter>[]) {
  return class Link extends Component<props<parameter>> {
    static displayName = 'RouteConsumer';
    render(Props: Props<props<parameter>>) {
      return (
        <Props>{_props =>
          null
        }</Props>
      );
    }
  };
}
