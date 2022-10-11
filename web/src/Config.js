export const Config = {
    appName: 'Final Project',
    // Thr front base url
    appBaseUrl: 'http://localhost:4000/',
    // appBaseUrl: 'http://group5.app-super.link/',
    apiUser: 'finalproject',
    // connect api key, most important
    apiKey: 'ce90b9d7-2422-4e79-9e47-49fe80f9e623',
    auth_rules: {
        user: ['/items', '/profile'],
        admin: ['/profile','/userlist','/rolelist', '/items', '/category']
    }
}