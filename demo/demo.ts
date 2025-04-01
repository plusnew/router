import { createRootRoute, schema } from "../src";

const rootRoute = createRootRoute({});
const tableRoute = rootRoute.createChildRoute("table", {
  page: schema.number({ default: 0 }),
  size: schema.number({ default: 10 }),
  sort: schema.object({
    order: schema.string({
      default: "desc",
      validate: (value) => value === "asc" || value === "desc",
    }),
    field: schema.string({
      default: "id",
      validate: (value) => value === "id" || value === "name",
    }),
  }),
});

async function Content(url: string) {
  return rootRoute.map(url, async ({ hasChildRouteActive }) =>
    hasChildRouteActive
      ? tableRoute.map(url, async ({ hasChildRouteActive, parameter }) => {
          const { items, totalCount } = await getItems({
            page: parameter.table.page,
            size: parameter.table.size,
            sortField: parameter.table.sort.field,
            sortOrder: parameter.table.sort.order,
          });

          function TableHead(field: "name" | "id") {
            return `<th>${A(
              tableRoute.createPath({
                "/": parameter["/"],
                table: {
                  page: 0,
                  size: parameter.table.size,
                  sort: {
                    field,
                    order:
                      parameter.table.sort.field === field
                        ? switchOrder(parameter.table.sort.order)
                        : "desc",
                  },
                },
              }),
              parameter.table.sort.field === field,
              field,
            )}</th>`;
          }

          return `<table><thead><tr>
              ${TableHead("id")}
              ${TableHead("name")}
            </tr></thead>
            <tbody>${items.map((item) => `<tr><td>${item.id}</td><td>${item.name}</td></tr>`).join("\n")}</tbody></table>`;
        })
      : `<article>Hi there!</article>`,
  );
}

function NavigationBar(url: string) {
  return `<nav><ul>
    <li>${A(
      rootRoute.createPath({ "/": {} }),
      rootRoute.map(
        url,
        ({ hasChildRouteActive }) => hasChildRouteActive === false,
      ) ?? false,
      "start",
    )}</li>
    <li>${A(
      tableRoute.createPath({
        "/": {},
        table: {
          page: null,
          size: null,
          sort: {
            field: null,
            order: null,
          },
        },
      }),
      tableRoute.map(url, () => true) ?? false,
      "table",
    )}</li>
  </ul>
</nav>`;
}

async function render(url: string) {
  const navigationbar = NavigationBar(url);
  const content = Content(url);

  document.body.innerHTML = `${navigationbar}Loading`;
  document.body.innerHTML = `${navigationbar}${(await content) ?? "Not Found"}`;
}

function A(url: string, active: boolean, content: string) {
  return `<a class="${active ? "active" : ""}" href="${url}">${content}<a>`;
}

function switchOrder(order: "asc" | "desc") {
  return order === "asc" ? "desc" : "asc";
}

function getItems(options: {
  page: number;
  size: number;
  sortOrder: "asc" | "desc";
  sortField: "id" | "name";
}) {
  const totalCount = 25;

  return {
    totalCount,
    items: Array.from({ length: totalCount }, (_, index) => ({
      id: index,
      name: String.fromCodePoint(90 - index),
    }))
      .toSorted((a, b) =>
        options.sortField === "id" ? a.id - b.id : a.name.localeCompare(b.name),
      )
      .slice(
        options.page * options.size,
        options.page * options.size + options.size,
      ),
  };
}

render(window.location.pathname);
