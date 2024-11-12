import type { Core } from '@strapi/strapi';
import type * as StrapiTypes from '@strapi/types/dist';
import { PluginSettingsResponse, RankUpdate } from '../../../typings';

const dragdrop = ({ strapi }: { strapi: Core.Strapi }) => ({

  getWelcomeMessage() {
    return {
      body: 'Welcome to Strapi 🚀'
    };
  },

  async sortIndex(contentType: StrapiTypes.UID.CollectionType, start: number, limit: number, locale: string, rankFieldName: string) {
    let indexData = {
      sort: {},
      populate: '*',
      start: start,
      limit: limit,
      locale: locale,
    };
    indexData.sort[rankFieldName] = 'asc';
    try {
      return await strapi.documents(contentType).findMany(indexData);
    } catch (err) {
      return {};
    }
  },

  /**
   *
   * @param {RankUpdate[]} updates
   * @param {StrapiTypes.UID.CollectionType} contentType
   */
  async batchUpdate(config: PluginSettingsResponse, updates: RankUpdate[], contentType: StrapiTypes.UID.CollectionType) {
    const sortFieldName = config.body.rank;
    const shouldTriggerWebhooks = config.body.triggerWebhooks;
    const results = [];

    strapi["apiUpdate"] = true;

    for (const update of updates) {
      // update entry's rank in db
      const updatedEntry = await strapi.db.query(contentType).update({
        where: { id: update.id },
        data: {
          [sortFieldName]: update.rank,
        },
      });

      if (updatedEntry?.id) {
        results.push(updatedEntry);

        // Trigger webhook listener for updated entry
        //see: https://forum.strapi.io/t/trigger-webhook-event-from-api/35919/5
        if (shouldTriggerWebhooks) {
          const info: Record<string, unknown> = {
            model: contentType.split('.').at(-1),
              entry: {
                id: updatedEntry.id,
                ...updatedEntry,
              },
          }
                    
          await strapi.get("webhookRunner").executeListener({
            event: 'entry.update',
            info,
          });
        }
      }
    }

    strapi["apiUpdate"] = undefined;

    if (results?.length !== updates?.length) {
      throw new Error('Error updating rank entries.');
    } else {
      return results.map((entry) => ({
        id: entry.id,
        rank: entry[sortFieldName],
      }));
    }
  },

});

export default dragdrop;
