// server/register.js
'use strict';

module.exports = ({ strapi }) => {
  // Iterating on every content-types
  Object.values(strapi.contentTypes).forEach(contentType => {
    // If this is an api content-type
    if (contentType.uid.includes('api::')) {
      // Add prconfigured content types here
    }
  });
};