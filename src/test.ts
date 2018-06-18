import { componentResult } from 'plusnew';

export function componentPartial<P>(component: componentResult<P>) {
  const componentpartial = component as componentResult<Partial<P>>;
  return componentpartial;
}