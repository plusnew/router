import { store } from 'plusnew';

const router = store(location.pathname, (_state, action: { type: 'push' | 'pop'; url: string }) => {
  if (action.type === 'push') {
    history.pushState({ path: action.url }, '', action.url);
  }

  return action.url;
});

export default router;

window.addEventListener('popstate', () => {
  router.dispatch({ type: 'pop', url: location.pathname });
});
