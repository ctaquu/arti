const request = require('supertest');
const httpCodes = require('http-status-codes');
const app = require('../common/server').app;
const setup = require('./setup');

let token = '';

beforeAll(async () => {
    token = await setup.token();
});

describe('Articles', () => {
    it('List Articles', async () => {

        const res = await request(app)
            .get('/api/v1/articles')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toEqual(httpCodes.OK);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveLength(3);
    });

    it('Fetch One Article', async () => {

        const res = await request(app)
            .get('/api/v1/articles/1')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toEqual(httpCodes.OK);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toStrictEqual({
            "id": 1,
            "isPublished": true,
            "user": {
                "id": 1,
                "name": "Damjan Veljkovic"
            },
            "title": "Me first article!!",
            "description": "An EDITED article is a word used to modify a noun, which is a person, place, object, or idea. Technically, an article is an adjective, which is any word that modifies a noun. Usually adjectives modify nouns through description, but articles are used instead to point out or refer to nouns."
        });

    });

    it('Fetch Article History', async () => {

        const res = await request(app)
            .get('/api/v1/articles/1/history')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toEqual(httpCodes.OK);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveLength(3);
    });

    it('Switch Article Version', async () => {

        const res1 = await request(app)
            .get('/api/v1/articles/1')
            .set('Authorization', token)
            .send();

        expect(res1.statusCode).toEqual(httpCodes.OK);
        expect(res1.body).toHaveProperty('data');
        expect(res1.body.data.title).toEqual('Me first article!!');

        const res2 = await request(app)
            .patch('/api/v1/articles/1/version')
            .set('Authorization', token)
            .send({
                "versionId": 3,
            });

        expect(res2.statusCode).toEqual(httpCodes.OK);
        expect(res2.body).toStrictEqual({
            "result": 'version switched',
        });

        const res3 = await request(app)
            .get('/api/v1/articles/1')
            .set('Authorization', token)
            .send();

        expect(res3.statusCode).toEqual(httpCodes.OK);
        expect(res3.body).toHaveProperty('data');
        expect(res3.body.data.title).toEqual('Me first article 666!!');

    });

    it('Create new Article', async () => {

        const res1 = await request(app)
            .get('/api/v1/articles/4')
            .set('Authorization', token)
            .send();

        expect(res1.statusCode).toEqual(httpCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors');
        expect(res1.body.errors).toEqual([
            "Article with ID: 4 not found"
        ]);

        const title = `My precious!!!`;
        const description = `"Precious, precious, precious!" Gollum cried. "My Precious! O my Precious!" And with that, even as his eyes were lifted up to gloat on his prize, he stepped too far, toppled, wavered for a moment on the brink, and then with a shriek he fell. Out of the depths came his last wail precious, and he was gone.”`;

        const res2 = await request(app)
            .post('/api/v1/articles')
            .set('Authorization', token)
            .send({
                "title": title,
                "description": description,
            });

        expect(res2.statusCode).toEqual(httpCodes.OK);
        expect(res2.body).toStrictEqual({
            "result": 'created',
        });

        const res3 = await request(app)
            .get('/api/v1/articles/4')
            .set('Authorization', token)
            .send();

        expect(res3.statusCode).toEqual(httpCodes.OK);
        expect(res3.body).toHaveProperty('data');
        expect(res3.body.data.title).toEqual(title);
        expect(res3.body.data.description).toEqual(description);

    });

    it('Edit Article Success', async () => {

        const res1 = await request(app)
            .get('/api/v1/articles/1')
            .set('Authorization', token)
            .send();

        expect(res1.statusCode).toEqual(httpCodes.OK);
        expect(res1.body).toHaveProperty('data');
        expect(res1.body.data.title).toEqual('Me first article 666!!');

        const newTitle = `Top of the world, 'ma!!`;
        const newDescription = `Don't have time to get something fancy... :'(`;

        const res2 = await request(app)
            .patch('/api/v1/articles/1')
            .set('Authorization', token)
            .send({
                "title": newTitle,
                "description": newDescription,
            });

        expect(res2.statusCode).toEqual(httpCodes.OK);
        expect(res2.body).toStrictEqual({
            "result": 'edited',
        });

        const res3 = await request(app)
            .get('/api/v1/articles/1')
            .set('Authorization', token)
            .send();

        expect(res3.statusCode).toEqual(httpCodes.OK);
        expect(res3.body).toHaveProperty('data');
        expect(res3.body.data.title).toEqual(newTitle);

    });

    it('Edit Article Fail due to not being owner of article', async () => {

        const res = await request(app)
            .patch('/api/v1/articles/3')
            .set('Authorization', token)
            .send({
                "title": "bad bad title",
                "description": "does not matter",
            });

        expect(res.statusCode).toEqual(httpCodes.UNAUTHORIZED);
        expect(res.body).toStrictEqual({
            "errors": [
                "tried to edit someone else's resource (Article)"
            ]
        });
    });

    it('Publish Article', async () => {

        const res1 = await request(app)
            .get('/api/v1/articles/2')
            .set('Authorization', token)
            .send();

        expect(res1.statusCode).toEqual(httpCodes.OK);
        expect(res1.body).toHaveProperty('data');
        expect(res1.body.data.isPublished).toEqual(false);

        const res2 = await request(app)
            .patch('/api/v1/articles/2/publish')
            .set('Authorization', token)
            .send();

        expect(res2.statusCode).toEqual(httpCodes.OK);
        expect(res2.body).toStrictEqual({
            "result": "published"
        });


        const res3 = await request(app)
            .get('/api/v1/articles/2')
            .set('Authorization', token)
            .send();

        expect(res3.statusCode).toEqual(httpCodes.OK);
        expect(res3.body).toHaveProperty('data');
        expect(res3.body.data.isPublished).toEqual(true);
    });

    it('Unpublish Article', async () => {

        const res1 = await request(app)
            .get('/api/v1/articles/1')
            .set('Authorization', token)
            .send();

        expect(res1.statusCode).toEqual(httpCodes.OK);
        expect(res1.body).toHaveProperty('data');
        expect(res1.body.data.isPublished).toEqual(true);

        const res2 = await request(app)
            .patch('/api/v1/articles/1/unpublish')
            .set('Authorization', token)
            .send();

        expect(res2.statusCode).toEqual(httpCodes.OK);
        expect(res2.body).toStrictEqual({
            "result": "unpublished"
        });

        const res3 = await request(app)
            .get('/api/v1/articles/1')
            .set('Authorization', token)
            .send();

        expect(res3.statusCode).toEqual(httpCodes.OK);
        expect(res3.body).toHaveProperty('data');
        expect(res3.body.data.isPublished).toEqual(false);
    });
});