'use strict';

module.exports = {
  async count(ctx) {
    ctx.body = await strapi
      .plugin('drag-drop-content-types')
      .service('task')
      .count();
  },
  async getSettings(ctx) {
    try {
      ctx.body = await strapi
        .plugin('drag-drop-content-types')
        .service('task')
        .getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async setSettings(ctx) {
    const { body } = ctx.request;
    try {
      await strapi
        .plugin('drag-drop-content-types')
        .service('task')
        .setSettings(body);
      ctx.body = await strapi
        .plugin('drag-drop-content-types')
        .service('task')
        .getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
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