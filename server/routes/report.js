'use strict';

/**
 *  router.
 */

module.exports = {
  type: 'content-api', // other type available: admin.
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: 'report.findMany',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};