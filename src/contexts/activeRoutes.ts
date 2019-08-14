import { context, store } from '@plusnew/core';
import { RouteParameterSpec } from 'types/mapper';

export type route = {
  namespaces: string[],
  spec: RouteParameterSpec,
};

export const storeFactory = () => store([] as route[]);

export default context<route[], route[]>();
