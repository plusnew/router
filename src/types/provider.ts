export type provider = {
  url: string,
  push: (url: string) => void;
  pop: () => void;
};
