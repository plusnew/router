import { context } from '@plusnew/core';
import { parameterSpecToType, parameterSpecTemplate } from '../types/mapper';

type linkHandler = {
  isNamespaceActive: (namespaces: string, url: string) => boolean;
  createUrl: <Spec extends parameterSpecTemplate>(namespace: string, spec: Spec, params: any) => string;
  parseUrl: <Spec extends parameterSpecTemplate>(namespace: string, spec: Spec, url: string) => parameterSpecToType<Spec>
};

export default context<linkHandler, never>();
