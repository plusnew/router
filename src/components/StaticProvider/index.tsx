import plusnew, { component, Props } from 'plusnew';

type props = {
  url: string;
  onchange: (url: string) => void;
  children: any;
};

export default component(
  __dirname,
  (Props: Props<props>) =>
    <Props>{props =>
      props.children
    }</Props>,
);
