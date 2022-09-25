'use strict';

const { createCoreService } = require('@strapi/strapi').factories;

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
    rank: 'rank',
    title: 'title',
  };
  await pluginStore.set({ key: 'settings', value });
  return pluginStore.get({ key: 'settings' });
}

module.exports = createCoreService('plugin::drag-drop-content-types.sort', {
  async getSettings() {
    const pluginStore = getPluginStore();
    let config = await pluginStore.get({ key: 'settings' });
    if (!config) {
      config = await createDefaultConfig();
    }
    return config;
  },
  async setSettings(settings) {
    const value = settings;
    const pluginStore = getPluginStore();
    await pluginStore.set({ key: 'settings', value });
    return pluginStore.get({ key: 'settings' });
  },
  async index() {
    return await strapi.query('api::foo.foo').count();
  },
  async update(id, contentType, rank) {
    return await strapi.query(contentType).update({
      where: { id: id },
      data:{
        rank: rank,
      }
    });
  },
});