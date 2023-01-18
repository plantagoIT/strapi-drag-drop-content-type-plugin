// @ts-check
'use strict';

const { z } = require('zod');

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
      title: 'title',
    },
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
async function index(contentType, start, limit, locale) {
  return await strapi.entityService.findMany(contentType, {
    sort: {
      rank: 'asc',
    },
    populate: '*',
    start: start,
    limit: limit,
    locale: locale,
  });
}

// Update rank of specified content type
async function update(id, contentType, rank) {
  return await strapi.query(contentType).update({
    where: { id: id },
    data: {
      rank: rank,
    },
  });
}

/**
 *
 * @param {RankUpdate[]} updates
 * @param {string} contentType
 */
async function batchUpdate(updates, contentType) {
  const config = await getSettings();
  const sortFieldName = config.body.rank;
  console.log('sortFieldName: ', sortFieldName);
  const results = [];

  for (const update of updates) {
    // update entry's rank in db
    try {
      const updatedEntry = await strapi.db.query(contentType).update({
        where: { id: update.id },
        data: {
          [sortFieldName]: update.rank,
        },
      });
      updatedEntry?.id && results.push(updatedEntry);
    } catch (err) {
      console.log(err);
    }
  }
  if (results?.length !== updates?.length) {
    throw new Error('Error updating rank entries.');
  } else {
    return results.map((entry) => ({
      id: entry.id,
      rank: entry[sortFieldName],
    }));
  }
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
      ctx.body = await index(
        ctx.request.body.contentType,
        ctx.request.body.start,
        ctx.request.body.limit,
        ctx.request.body.locale
      );
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async update(ctx) {
    try {
      ctx.body = await update(
        ctx.params.id,
        ctx.request.body.contentType,
        ctx.request.body.rank
      );
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async batchUpdate(ctx) {
    try {
      const payload = await BatchUpdateRequestSchema.parseAsync(
        ctx.request.body
      );
      try {
        ctx.body = await batchUpdate(payload.updates, payload.contentType);
      } catch (err) {
        ctx.throw(500, err);
      }
    } catch (err) {
      ctx.throw(400, err);
    }
  },
};

// TYPE-SAFETY AND VALIDATION

// Request schema used for parsing/validating incoming API requests. Uses Zod which works well with Typescript if used in the future.
const RankUpdateSchema = z.object({
  id: z.number(),
  rank: z.number(),
});
const BatchUpdateRequestSchema = z.object({
  contentType: z.string(),
  updates: z.array(RankUpdateSchema),
});

// Try to enforce Typescript types in Javascript using JSDoc
/** @typedef { z.infer<typeof RankUpdateSchema> } RankUpdate */
