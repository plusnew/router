import { RouteParamsSpec, SpecToType } from 'types/mapper';

export default function factory<Spec extends RouteParamsSpec>(namespace: string, spec: Spec) {
  return <Params extends RouteParamsSpec>(params: SpecToType<Params>) => {
    return Object.keys(spec).reduce((previousValue, specKey) => {
      return previousValue + '/' + specKey + '/' + params[specKey];
    }, '/' + namespace);
  };
}
