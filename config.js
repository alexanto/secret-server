if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config({ path: '.env'});
}

const config = {
    port: process.env.PORT || 8081,
};

module.exports = config;