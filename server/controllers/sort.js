'use strict';

module.exports = {
  async getSettings(ctx) {
    try {
      ctx.body = await strapi
        .plugin('drag-drop-content-types')
        .service('sort')
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
        .service('sort')
        .setSettings(body);
      ctx.body = await strapi
        .plugin('drag-drop-content-types')
        .service('sort')
        .getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
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
    console.log(ctx.request.body)
    try {
      ctx.body = await strapi
        .plugin("drag-drop-content-types")
        .service("sort")
        .update(ctx.params.id, ctx.request.body.contentType, ctx.request.body.rank);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};