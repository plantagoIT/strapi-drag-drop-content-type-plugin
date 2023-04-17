'use strict';

// Get the store from the drag-drop plugin
function getPluginStore() {
  return strapi.store({
    environment: '',
    type: 'plugin',
    name: 'drag-drop-content-types',
  });
}

// Create a default config if there is none yet
async function createDefaultConfig() {
  const pluginStore = getPluginStore();
  const value = {
    body: {
      rank: 'rank',
      title: '',
    }
  };
  await pluginStore.set({ key: 'settings', value });
  return pluginStore.get({ key: 'settings' });
}

// Get settings from plugin store
async function getSettings() {
  const pluginStore = getPluginStore();
  let config = await pluginStore.get({ key: 'settings' });
  if (!config) {
    config = await createDefaultConfig();
  }
  return config;
}

// Update settings to plugin store
async function setSettings(settings) {
  const value = settings;
  const pluginStore = getPluginStore();
  await pluginStore.set({ key: 'settings', value });
  return pluginStore.get({ key: 'settings' });
}

// Search for entries ordered by rank
async function index(contentType, start, limit, locale, rankFieldName) {
  let indexData = {
    sort: { },
    populate: '*',
    start: start,
    limit: limit,
    locale: locale,
  }
  indexData.sort[rankFieldName] = 'asc'
  try {
    return await strapi.entityService.findMany(contentType, indexData );
  } catch (err) {
    return {};
  }
}

// Update rank of specified content type
async function update(id, contentType, rank, rankFieldName) {
  let updateData = {
    where: { id: id },
    data: {}
  }
  updateData.data[rankFieldName] = rank;
  return await strapi.query(contentType).update(updateData);
}

module.exports = {
  async getSettings(ctx) {
    try {
      ctx.body = await getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async setSettings(ctx) {
    const { body } = ctx.request;
    try {
      await setSettings(body);
      ctx.body = await getSettings();
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async index(ctx) {
    try {
      ctx.body = await index(ctx.request.body.contentType, ctx.request.body.start, ctx.request.body.limit, ctx.request.body.locale, ctx.request.body.rankFieldName);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async update(ctx) {
    try {
      ctx.body = await update(ctx.params.id, ctx.request.body.contentType, ctx.request.body.rank, ctx.request.body.rankFieldName);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};