// const constants = require ('../common/constants');
// const utils = require('../common/utils')
// const models = require('../database/models/index');
// const moment = require('moment');
// const sequelize = require('../database/models/index').sequelize;
const request = require('supertest');
const app = require('../common/server').app;

module.exports = {
    initialize: () => {
        console.info('initialize');
    },
    destroy: () => {
        console.info('destroy');
        // sequelize.sync({force: true});
    },
    token: () => {
        return new Promise((async resolve => {

            const res = await request(app)
                .post('/api/v1/users/token')
                .send({
                    "email": "damjan.veljkovic@gmail.com",
                    "password": "testtest"
                });

            resolve(`Bearer ${res.body.data.token}`);
        }))
    },
};