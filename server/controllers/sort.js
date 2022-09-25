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
    body:{
      rank: 'rank',
      title: 'title',
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

// Update rank of specified content type
async function update(id, contentType, rank) {
  return await strapi.query(contentType).update({
    where: { id: id },
    data: {
      rank: rank,
    }
  });
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
  async update(ctx) {
    try {
      ctx.body = await update(ctx.params.id, ctx.request.body.contentType, ctx.request.body.rank);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};