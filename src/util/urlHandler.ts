import { linkHandler } from 'contexts/urlHandler';

export const createUrl: linkHandler['createUrl'] = () => {
  return '';
};

export const parseUrl: linkHandler['parseUrl'] = (routeChain, url) => {
  const result = {} as any;
  const urlParts = url.split('/');
  urlParts;

  return result;
};

export const isNamespaceActive: linkHandler['isNamespaceActive'] = () => {
  return true;
};
