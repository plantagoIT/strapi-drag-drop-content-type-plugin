'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('plugin::drag-drop-content-types.task', {
  async count() {
    return await strapi.query('plugin::drag-drop-content-types.task').count();
  },
  async create(data) {
    return await strapi.query("plugin::drag-drop-content-types.task").create(data);
  },
  async update(id, data) {
    console.log("*************************************************************")

    return await strapi.query("plugin::drag-drop-content-types.task").update({
      where: { id },
      data,
    });
  },
});