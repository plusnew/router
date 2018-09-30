import { RouteParamsSpec, SpecToType } from 'types/mapper';

export default class UrlHandler<Spec extends RouteParamsSpec> {
  public namespace: string;
  private spec: Spec;

  constructor(namespace: string, spec: Spec) {
    this.namespace = namespace;
    this.spec = spec;
  }

  public isCurrentNamespace(url: string) {
    return url.indexOf(this.namespace) !== 0;
  }

  public parseUrl(url: string): SpecToType<Spec> {
    if (this.isCurrentNamespace(url) === false) {
      throw new Error('Can not parse Url for wrong namespace');
    }
    return {} as any;
  }

  public buildUrl <Params extends RouteParamsSpec>(params: SpecToType<Params>) {
    return Object.keys(this.spec).reduce((previousValue, specKey) => {
      return previousValue + '/' + specKey + '/' + params[specKey];
    }, '/' + this.namespace);
  }
}
