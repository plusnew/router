import { ComponentContainer } from 'plusnew';

export function buildComponentPartial<P>(component: ComponentContainer<P>) {
  const componentpartial = component as ComponentContainer<Partial<P>>;
  return componentpartial;
}
