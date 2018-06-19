import { RouteParamsSpec, SpecToType } from './types';

export function getUrlParts(url: string) {
  return url.split('/').slice(1);
}

export function isCurrentNamspace (namespace: string, urlParts: string[]) {
  return namespace === urlParts[0];
}

export function getCurrentParams<Spec extends RouteParamsSpec>(spec: Spec, urlParts: string[]): SpecToType<Spec> {
  let params: any = {};
  for (let i = 1; i < urlParts.length; i += 2) {
    const urlKey = urlParts[i];
    const urlValue = urlParts[i + 1];

    if (spec[urlKey] === 'number') {
      params[urlKey] = Number(urlValue);
    } else {
      params[urlKey] = urlValue;
    }
  }

  return params as SpecToType<Spec>;
}