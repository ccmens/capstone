const config = {
    server_host: 'localhost',
    server_port: 4000,
    database_url: 'mongodb://localhost:27017/inventorydb',
    prefix: '/api',
    verion: '1.0',
    http_url: 'http://localhost:4000',

    is_server: false,
    access_token_secret: '269262d1ce5a13ff880ab731ddb044d47035031d3468b9fb79092db3aea6eaddb4cdb5469f8a34c973353bd8c76358d2bd86926a49edbcfce620d53a5c0a2691',
    access_token_expires_in: '24h',
    without_check_token: [
        '/api/user/login', 
        '/api/user/tokenLogin', 
        '/api/user/register',
        '/favicon.ico',
    ],
    upload: {
        path: 'public/upload/',
        profile_path: 'public/upload/profile/',
        item_path: 'public/upload/item/',
        fileSize: 10 * 1024 * 1024,
    }
};

module.exports = config;