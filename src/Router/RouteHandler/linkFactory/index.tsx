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

export default function linkFactory<Spec extends RouteParamsSpec>(router: Router, routeStore: routeStore<Spec>, urlHandler: UrlHandler<Spec>) {
  return class Link extends Component<props<Spec>> {
    render(Props: Props<props<Spec>>) {
      return (
        <Props>
          {props =>
            <routeStore.Observer>
              {(routeState) => {
                const targetUrl = urlHandler.buildUrl(props.parameter);
                let className = 'router__link';

                if (routeState.active && urlHandler.buildUrl(routeState.parameter) === targetUrl) {
                  className += ' router__link--active';
                }

                return plusnew.createElement(
                  'a',
                  {
                    className,
                    href: targetUrl,
                    onclick: (evt: MouseEvent) => {
                      if (hasModifier(evt) === false) {
                        evt.preventDefault();
                        router.provider.push(targetUrl);
                      }
                    },
                  },
                  ...props.children,
                );
              }}
            </routeStore.Observer>
          }
        </Props>
      );
    }
  };
}
