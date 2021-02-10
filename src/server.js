const app = require('./app');
const config = require('./config');
const mongo = require('./db/mongo');

const {port} = config;

(async function() {
    try {
        await mongo.init();
    } catch (e) {
        console.log('Could not connect to MongoDB database', e);
    }

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    })
})();


