import { ComponentContainer } from '@plusnew/core';

export function buildComponentPartial<P>(component: ComponentContainer<P>): ComponentContainer<Partial<P>> {
  return component as any;
}
