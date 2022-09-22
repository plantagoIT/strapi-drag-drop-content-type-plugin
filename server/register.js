// server/register.js
'use strict';

module.exports = ({ strapi }) => {
  // Iterating on every content-types
  Object.values(strapi.contentTypes).forEach(contentType => {
    // If this is an api content-type
    if (contentType.uid.includes('api::')) {
      // Add tasks property to the content-type
      contentType.attributes.tasks = {
        type: 'relation',
        relation: 'morphMany',
        target: 'plugin::drag-drop-content-types.task', // internal slug of the target
        morphBy: 'related', // field in the task schema that is used for the relation
        private: false, // false: This will not be exposed in API call
        configurable: false,
      };
    }
  });
};