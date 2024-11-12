export default {
    type: 'admin',
    routes: [
        {
            method: 'GET',
            path: '/settings',
            handler: 'settings.getSettings',
            config: { policies: [] }
        },
        {
            method: 'POST',
            path: '/settings',
            handler: 'settings.setSettings',
            config: { policies: [] }
        }
    ]
}