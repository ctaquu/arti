const express = require('express');
const bodyParser = require('body-parser');
const httpCodes = require('http-status-codes');
const router = express.Router();
const _ = require('lodash');
const moment = require('moment');
const cors = require('cors')({origin: true});

const app = express();
const port = 3000;

/**
 * just a server availability test
 */
router.get("/ping", async (request, response) => {

    try {
        response.status(httpCodes.ACCEPTED).send({status: 'ping A-OK'});
    } catch (error) {
        console.error('E0001', error.toString());
        response.status(httpCodes.INTERNAL_SERVER_ERROR).send({error: error.toString()});
    }
});

app.use(cors);
app.use("/api/v1", router);
app.listen(port, () => console.log(`Listening on port ${port}!`));
