import { context, store } from '@plusnew/core';
import { RouteParamsSpec } from 'types/mapper';

export type route = {
  namespaces: string[],
  spec: RouteParamsSpec,
};

export const storeFactory = () => store([] as route[]);

export default context<route[], route[]>();
