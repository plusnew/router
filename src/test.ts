import { ComponentContainer } from 'plusnew';

export function buildComponentPartial<P>(component: ComponentContainer<P>): ComponentContainer<Partial<P>> {
  return component as any;
}
