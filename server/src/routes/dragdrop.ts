export default {
    //type: admin: internal and can be accessible only by the admin part (front-end part) of the plugin
    //type: content-api: accessible from external classical rest api, need to set access in strapi's Users & Permissions plugin
    //call: http://localhost:1337/api/drag-drop-content-types/ and you'll receive getWelcomeMessage()

    type: 'admin', //changed from content-api to admin
    routes: [
        {
            method: 'GET',
            path: '/welcome',
            handler: 'dragdrop.welcome',
            config: { 
              policies: [],
              auth: false,
            }
        },
        {
            method: 'POST',
            path: '/sort-index',
            handler: 'dragdrop.sortIndex',
            config: {
              policies: [],
              auth: false,
            },
          },
          {
            method: 'PUT',
            path: '/batch-update',
            handler: 'dragdrop.batchUpdate',
            config: {
              policies: [],
              auth: false,
            },
          },
      
    ]
}