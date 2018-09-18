export type provider = {
  url: string,
  stream: ReadableStream,
  push: (url: string) => void;
  pop: () => void;
};
