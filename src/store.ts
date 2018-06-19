import { store } from 'plusnew';

export default store(location.href, (_state, action: string) => {
  return action;
});
