import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import SortModal from './components/SortModal';


const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: `${pluginId}.plugin.name`,
          defaultMessage: 'Drag Drop Content Types',
        },
      },
      [
        {
          intlLabel: {
            id: `${pluginId}.plugin.name`,
            defaultMessage: 'Configuration',
          },
          id: 'settings',
          to: `/settings/${pluginId}`,
          Component: async () => {
            return import('./pages/Settings');
          },
        },
      ]
    );
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap(app) {
    app.injectContentManagerComponent("listView", "actions", {
      name: "sort-component",
      Component: SortModal,
    });

    app.registerHook('Admin/CM/pages/ListView/inject-column-in-table', ({ displayedHeaders, layout }) => {
      return {
        layout,
        displayedHeaders: [
          ...displayedHeaders,
          {
            key: '__locale_key__', // Needed for the table
            fieldSchema: { type: 'string' }, // Schema of the attribute
            metadatas: {
              label: 'Raboo', // Label of the header,
              sortable: true | false // Define if the column is sortable
            }, // Metadatas for the label
            // Name of the key in the data we will display
            name: 'locales',
            // Custom renderer: props => Object.keys(props).map(key => <p key={key}>key</p>)
          },
        ]
      }
    });
  },

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );
    return Promise.resolve(importedTrads);
  },
};
