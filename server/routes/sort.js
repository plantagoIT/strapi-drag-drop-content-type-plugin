

module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/settings',
      handler: 'sort.getSettings',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/settings',
      handler: 'sort.setSettings',
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
  ],
};