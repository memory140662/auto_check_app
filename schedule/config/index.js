if (process.env.NODE_ENV === 'production') {
    module.exports = {
        config: {
            apiKey: process.env.API_KEY,
            authDomain: process.env.AUTH_DOMAIN,
            databaseURL: process.env.DATABASE_URL,
            projectId: process.env.PROJECT_ID,
            storageBucket: process.env.STORAGE_BUCKET,
            messagingSenderId: process.env.MESSAGING_SENDER_ID
        },
        data: require('./data.json')
    }
} else {
    module.exports = {
        config: require('./config'),
        data: require('./data.json')
    }
}