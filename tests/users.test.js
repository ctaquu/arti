const request = require('supertest');
const httpCodes = require('http-status-codes');
const app = require('../common/server').app;

describe('Users', () => {
    it('Fetch Token Success', async () => {

        const res = await request(app)
            .post('/api/v1/users/token')
            .send({
                "email": "damjan.veljkovic@gmail.com",
                "password": "testtest"
            });

        expect(res.statusCode).toEqual(httpCodes.ACCEPTED);
        expect(res.body).toHaveProperty('data');
    });

    it('Fetch Token Fail due to invalid password', async () => {

        const res = await request(app)
            .post('/api/v1/users/token')
            .send({
                "email": "damjan.veljkovic@gmail.com",
                "password": "badPass"
            });

        expect(res.statusCode).toEqual(httpCodes.UNAUTHORIZED);
        expect(res.body).toHaveProperty('errors');
    });

    it('Fetch Token Fail due to invalid email', async () => {

        const res = await request(app)
            .post('/api/v1/users/token')
            .send({
                "email": "damjan.bad@gmail.com",
                "password": "test"
            });

        expect(res.statusCode).toEqual(httpCodes.UNAUTHORIZED);
        expect(res.body).toHaveProperty('errors');
    });

    it('Fetch Token Fail due to missing email', async () => {

        const res = await request(app)
            .post('/api/v1/users/token')
            .send({
                "password": "test"
            });

        expect(res.statusCode).toEqual(httpCodes.BAD_REQUEST);
        expect(res.body).toStrictEqual({errors: ["missing parameter: email"]});
    });

    it('Fetch Token Fail due to missing password', async () => {

        const res = await request(app)
            .post('/api/v1/users/token')
            .send({
                "email": "damjan.veljkovic@gmail.com",
            });

        expect(res.statusCode).toEqual(httpCodes.BAD_REQUEST);
        expect(res.body).toStrictEqual({errors: ["missing parameter: password"]});
    });
});
