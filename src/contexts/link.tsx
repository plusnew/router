import { context } from 'plusnew';
import { SpecToType, RouteParamsSpec } from '../types/mapper';

type linkHandler = {
  isNamespaceActive: (namespace: string, url: string) => boolean;
  createLink: <Spec extends RouteParamsSpec>(namespace: string, spec: Spec, params: any) => string;
  parseLink: <Spec extends RouteParamsSpec>(namespace: string, spec: Spec, link: any) => SpecToType<Spec>
};

export default context<linkHandler, never>();
