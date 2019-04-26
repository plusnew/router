import plusnew, { Component, Props } from 'plusnew';
import urlHandler from '../../../contexts/urlHandler';
import url from '../../../contexts/url';
import { RouteParamsSpec, SpecToType } from '../../../types/mapper';

type props<params extends RouteParamsSpec> = {
  parameter: SpecToType<params>;
  children: any;
};

function hasModifier(evt: MouseEvent) {
  return evt.altKey === true || evt.ctrlKey === true || evt.shiftKey === true || evt.metaKey === true;
}

export default function <
  spec extends RouteParamsSpec,
>(namespace: string, spec: spec) {
  return class RouterLink extends Component<props<spec>>{
    static displayName = 'RouteLink';
    render(Props: Props<props<spec>>) {
      return (
        <urlHandler.Consumer>{urlHandlerState =>
          <Props>{propsState =>
            <url.Consumer>{(urlState, dispatch) => {
              const targetUrl = urlHandlerState.createUrl(namespace, spec, propsState.parameter);

              let className = 'router__link';

              if (urlState === targetUrl) {
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
                      dispatch(targetUrl);
                    }
                  },
                },
                ...propsState.children,
              );
            }}</url.Consumer>
          }</Props>
        }</urlHandler.Consumer>
      );
    }
  };
}
