import type { Core } from '@strapi/strapi';
import { z } from 'zod';
import { PluginSettingsResponse } from '../../../typings';

const RankUpdateSchema = z.object({
  id: z.number(),
  rank: z.number(),
});
const BatchUpdateRequestSchema = z.object({
  contentType: z.string(),
  updates: z.array(RankUpdateSchema),
});

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({

  async welcome(ctx) {
    const dragdropService = strapi.plugin("drag-drop-content-types").service("dragdrop");

    try {
      ctx.body = await dragdropService.getWelcomeMessage();
    }
    catch (err) {
      ctx.throw(500, err);
    }
  },

  async sortIndex(ctx) {
    const dragdropService = strapi.plugin("drag-drop-content-types").service("dragdrop");

    try {
      ctx.body = await dragdropService.sortIndex(
        ctx.request.body.contentType,
        ctx.request.body.start,
        ctx.request.body.limit,
        ctx.request.body.locale,
        ctx.request.body.rankFieldName
      );
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async batchUpdate(ctx) {
    const settingService = strapi.plugin("drag-drop-content-types").service("settings");
    const dragdropService = strapi.plugin("drag-drop-content-types").service("dragdrop");

    try {
      const config: PluginSettingsResponse = await settingService.getSettings();

      const payload = await BatchUpdateRequestSchema.parseAsync(
        ctx.request.body
      );
      try {
        ctx.body = await dragdropService.batchUpdate(config, payload.updates, payload.contentType);
      } catch (err) {
        ctx.throw(500, err);
      }
    } catch (err) {
      ctx.throw(400, err);
    }
  },

});

export default controller;
