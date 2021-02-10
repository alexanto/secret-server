if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config({ path: '.env'});
}

const config = {
    port: process.env.PORT || 8081,
    mongoUser: process.env.MONGO_USER || "secret-server",
    mongoPwd: process.env.MONGO_PWD,
    dbName: process.env.DB_NAME || "secrets",
    encryptKey: process.env.ENCRYPT_KEY,
};

module.exports = config;