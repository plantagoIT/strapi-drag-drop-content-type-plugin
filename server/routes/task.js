// server/routes/task.js
'use strict';

/**
 *  router.
 */

module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/count',
      handler: 'task.count',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/settings',
      handler: 'task.getSettings',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/settings',
      handler: 'task.setSettings',
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "PUT",
      path: "/update/:id",
      handler: "task.update",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/create",
      handler: "task.create",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};