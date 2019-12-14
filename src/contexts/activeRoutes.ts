import { context, store } from '@plusnew/core';
import { parameterSpecTemplate } from '../types/mapper';

export type route = {
  namespace: string,
  parameterSpec: parameterSpecTemplate,
};

export const storeFactory = () => store([] as route[]);

export default context<route[], route[]>();
