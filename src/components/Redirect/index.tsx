import plusnew, { component, Props } from 'plusnew';

type props = {
  from: string;
  to: string
};

export default component(
  __dirname,
  (Props: Props<props>) =>
    <Props>{props =>
      props.to
    }</Props>,
);
