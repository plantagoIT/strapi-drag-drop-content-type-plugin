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
      method: 'POST',
      path: '/sort-index',
      handler: 'sort.index',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/batch-update',
      handler: 'sort.batchUpdate',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'PUT',
      path: '/sort-update/:id',
      handler: 'sort.update',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
