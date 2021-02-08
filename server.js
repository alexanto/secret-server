const app = require('./app');
const config = require('./config');

const {port} = config;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})