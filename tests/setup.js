const request = require('supertest');
const app = require('../common/server').app;

module.exports = {
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