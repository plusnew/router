import plusnew, { Props, Component } from 'plusnew';
import Router from '../..';
import { routeStore } from '../storeFactory';
import UrlHandler from '../UrlHandler';
import { RouteParamsSpec, SpecToType } from '../../../types/mapper';

type props<Spec extends RouteParamsSpec> = {
  parameter: SpecToType<Spec>;
  children: any
};

function hasModifier(evt: MouseEvent) {
  return evt.altKey === true || evt.ctrlKey === true || evt.shiftKey === true;
}

export default function linkFactory<Spec extends RouteParamsSpec>(router: Router, _routeStore: routeStore<Spec>, urlHandler: UrlHandler<Spec>) {
  return class Link extends Component<props<Spec>> {
    render(Props: Props<props<Spec>>) {
      return <Props render={props =>
        plusnew.createElement(
          'a',
          {
            href: urlHandler.buildUrl(props.parameter),
            onclick: (evt: MouseEvent) => {
              if (hasModifier(evt) === false) {
                evt.preventDefault();
                router.provider.push(urlHandler.buildUrl(props.parameter));
              }
            },
          },
          ...props.children,
        )
      } />;
    }
  };
}
