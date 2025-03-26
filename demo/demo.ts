import { createRootRoute } from "../src";

const rootRoute = createRootRoute({});
const tableRoute = rootRoute.createChildRoute("table", {});

function render(url: string) {
  document.body.innerHTML = `<nav>
  <ul>
    <li>${a(
      rootRoute.createPath({ "/": {} }),
      rootRoute.map(
        url,
        ({ hasChildRouteActive }) => hasChildRouteActive === false,
      ) ?? false,
      "start",
    )}</li>
    <li>${a(
      tableRoute.createPath({ "/": {}, table: {} }),
      tableRoute.map(url, () => true) ?? false,
      "table",
    )}</li>
  </ul>
</nav>
${content(url)}
`;
}

function content(url: string) {
  return (
    rootRoute.map(url, ({ hasChildRouteActive }) =>
      hasChildRouteActive ? null : `<article>Hi there!</article>`,
    ) ?? "Not found"
  );
}

function a(url: string, active: boolean, content: string) {
  return `<a class="${active ? "active" : ""}" href="${url}">${content}<a>`;
}

render(window.location.pathname);
