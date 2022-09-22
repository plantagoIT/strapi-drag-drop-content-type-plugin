'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('plugin::drag-drop-content-types.task', {
  async index() {
    return await strapi.query('api::foo.foo').count();
  },
  async count() {
    return await strapi.query('plugin::drag-drop-content-types.task').count();
  },
  async create(data) {
    return await strapi.query("plugin::drag-drop-content-types.task").create(data);
  },
  async update(id, rank) {
    console.log("updating stuff")
    return await strapi.query("api::foo.foo").update({
      where: { id: id },
      data:{
        rank: rank,
      }
    });
  },
});