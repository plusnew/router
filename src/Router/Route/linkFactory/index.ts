import { Props, Component } from 'plusnew';
import Router from '../..';
import { routeStore } from '../storeFactory';
import UrlHandler from '../UrlHandler';
import { RouteParamsSpec, SpecToType } from '../../../types/mapper';

type props<Spec extends RouteParamsSpec> = {
  parameter: SpecToType<Spec>;
};

export default function linkFactory<Spec extends RouteParamsSpec>(router: Router, store: routeStore<Spec>, urlHanlder: UrlHandler<Spec>) {
  return class Link extends Component<props<Spec>> {
    render(Props: Props<props<Spec>>) {
      return null;
    }
  };
}
