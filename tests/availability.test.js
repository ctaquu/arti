const moment = require('moment');
const request = require('supertest');
const httpCodes = require('http-status-codes');
const app = require('../common/server').app;
const setup = require('./setup');
const models = require('../database/models/index');

let token = '';

beforeAll(async () => {
    token = await setup.token();
});

describe('Server Availability', () => {
    it('Should ping API server (public endpoint)', async () => {
        const res = await request(app)
            .get('/api/v1/ping')
            .send();

        expect(res.statusCode).toEqual(httpCodes.ACCEPTED);
        expect(res.body).toStrictEqual({status: "ping A-OK"});
    });

    it('Should ping API server (protected endpoint) Success', async () => {
        const res = await request(app)
            .get('/api/v1/ping/protected')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toEqual(httpCodes.ACCEPTED);
        expect(res.body).toStrictEqual({status: "protected ping A-OK"});
    });

    it('Should ping API server (protected endpoint) Fail due to missing token', async () => {
        const res = await request(app)
            .get('/api/v1/ping/protected')
            .send();

        expect(res.statusCode).toEqual(httpCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty('errors');
    });

    it('Should ping API server (protected endpoint) Fail due to invalid token', async () => {
        const res = await request(app)
            .get('/api/v1/ping/protected')
            .set('Authorization', `${token}with-bad-data`)
            .send();

        expect(res.statusCode).toEqual(httpCodes.UNAUTHORIZED);
        expect(res.body).toHaveProperty('errors');
    });

    it('Should ping API server (protected endpoint) Fail due to expired token', async () => {

        const expiredToken = await setup.token();

        await models.UserToken.update({
            expires: moment().subtract(60, 'minutes').valueOf(),
        }, {
            where: {
                token: expiredToken.substring(7)
            }
        })
            .then(async () => {
                const res = await request(app)
                    .get('/api/v1/ping/protected')
                    .set('Authorization', expiredToken)
                    .send();

                expect(res.statusCode).toEqual(httpCodes.UNAUTHORIZED);
                expect(res.body).toHaveProperty('errors');
            });
    })
});