import { context } from '@plusnew/core';
import { SpecToType, RouteParameterSpec } from '../types/mapper';

type linkHandler = {
  isNamespaceActive: (namespaces: string, url: string) => boolean;
  createUrl: <Spec extends RouteParameterSpec>(namespace: string, spec: Spec, params: any) => string;
  parseUrl: <Spec extends RouteParameterSpec>(namespace: string, spec: Spec, url: string) => SpecToType<Spec>
};

export default context<linkHandler, never>();
