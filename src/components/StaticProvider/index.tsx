import plusnew, { component, Props } from 'plusnew';
import url from '../../contexts/url';
import urlHandler from '../../contexts/urlHandler';
import { isNamespaceActive, createUrl, parseUrl } from '../../util/urlHandler';

type props = {
  url: string;
  onchange: (url: string) => void;
  children: any;
};

export default component(
  'StaticProvider',
  (Props: Props<props>) =>
    <urlHandler.Provider
      state={{
        isNamespaceActive,
        createUrl,
        parseUrl,
      }}
      dispatch={null as never}
    >
      <Props>{props =>
        <url.Provider state={props.url} dispatch={props.onchange}>
          {props.children}
        </url.Provider>
      }</Props>
    </urlHandler.Provider>,
);
