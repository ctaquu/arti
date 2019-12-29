const request = require('supertest');
const httpCodes = require('http-status-codes');
const app = require('../common/server').app;
const setup = require('./setup');

let token = '';

beforeAll(async () => {
    token = await setup.token();
});

describe('Articles', () => {
    it('List Articles Success', async () => {

        const res = await request(app)
            .get('/api/v1/articles')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toEqual(httpCodes.OK);
        expect(res.body).toHaveProperty('data');
    });
});