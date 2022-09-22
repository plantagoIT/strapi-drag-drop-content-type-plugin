'use strict';

module.exports = {
  async index(ctx) {
    ctx.body = await strapi
      .plugin('drag-drop-content-types')
      .service('sort')
      .index();
  },
  async count(ctx) {
    ctx.body = await strapi
      .plugin('drag-drop-content-types')
      .service('sort')
      .count();
  },
  async create(ctx) {
    try {
      ctx.body = await strapi
        .plugin("drag-drop-content-types")
        .service("sort")
        .create(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async update(ctx) {
    try {
      ctx.body = await strapi
        .plugin("drag-drop-content-types")
        .service("sort")
        .update(ctx.params.id, ctx.request.body.data);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};