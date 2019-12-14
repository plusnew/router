import { linkHandler } from 'contexts/urlHandler';

export const createUrl: linkHandler['createUrl'] = () => {
  return '';
};

export const parseUrl: linkHandler['parseUrl'] = (routeChain, url) => {
  const result = {};
  const urlParts = url.split('/');

  return result;
};

export const isNamespaceActive: linkHandler['isNamespaceActive'] = () => {
  return true;
};
