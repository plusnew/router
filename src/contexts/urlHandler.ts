import { context } from 'plusnew';
import { SpecToType, RouteParamsSpec } from '../types/mapper';

type linkHandler = {
  isNamespaceActive: (namespaces: string, url: string) => boolean;
  createUrl: <Spec extends RouteParamsSpec>(namespace: string, spec: Spec, params: any) => string;
  parseUrl: <Spec extends RouteParamsSpec>(namespace: string, spec: Spec, url: string) => SpecToType<Spec>
};

export default context<linkHandler, never>();
