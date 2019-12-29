import express from 'express';

const cors = require('cors')({origin: true});
const app = express();
const router = express.Router();

// import all routes
//TODO: separate files for each resource
require('../routes')(router);

app.use(cors);
app.use("/api/v1", router);

module.exports = {
    app,
};
