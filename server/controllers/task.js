'use strict';

module.exports = {
  async count(ctx) {
    ctx.body = await strapi
      .plugin('drag-drop-content-types')
      .service('task')
      .count();
  },
  async create(ctx) {
    try {
      ctx.body = await strapi
        .plugin("drag-drop-content-types")
        .service("task")
        .create(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async update(ctx) {
    console.log("*************************************************************")
    try {
      ctx.body = await strapi
        .plugin("drag-drop-content-types")
        .service("task")
        .update(ctx.params.id, ctx.request.body.data);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};