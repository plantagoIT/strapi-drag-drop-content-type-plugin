

module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/sort-index',
      handler: 'sort.index',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/count',
      handler: 'sort.count',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "PUT",
      path: "/sort-update/:id",
      handler: "sort.update",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/sort-create",
      handler: "sort.create",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};