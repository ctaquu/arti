const request = require('supertest');
const httpCodes = require('http-status-codes');
const app = require('../common/server').app;
const setup = require('./setup');
const models = require('../database/models/index');

let token = '';

beforeAll(async () => {
    token = await setup.token();
});

describe('Drafts', () => {
    it('List Drafts For Logged-in user', async () => {

        const res = await request(app)
            .get('/api/v1/drafts')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toEqual(httpCodes.OK);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveLength(1);
    });

    it('Fetch One Draft', async () => {

        const res = await request(app)
            .get('/api/v1/drafts/1')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toEqual(httpCodes.OK);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toStrictEqual({
            "id": 1,
            "user": {
                "id": 1,
                "name": "Damjan Veljkovic"
            },
            "title": "All Around The Infinity",
            "description": "The accompanying spoken blessing, \"live long and prosper\" – \"dif-tor heh smusma\" in the Vulcan language (as spoken in Star Trek: The Motion Picture) – also appeared for the first time in \"Amok Time\", scripted by Theodore Sturgeon."
        });
    });

    it('Create new Draft', async () => {

        const res1 = await request(app)
            .get('/api/v1/drafts/3')
            .set('Authorization', token)
            .send();

        expect(res1.statusCode).toEqual(httpCodes.BAD_REQUEST);
        expect(res1.body).toHaveProperty('errors');
        expect(res1.body.errors).toEqual([
            "Draft with ID: 3 not found"
        ]);

        const title = `My precious!!!`;
        const description = `"Precious, precious, precious!" Gollum cried. "My Precious! O my Precious!" And with that, even as his eyes were lifted up to gloat on his prize, he stepped too far, toppled, wavered for a moment on the brink, and then with a shriek he fell. Out of the depths came his last wail precious, and he was gone.”`;

        const res2 = await request(app)
            .post('/api/v1/drafts')
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
            .get('/api/v1/drafts/3')
            .set('Authorization', token)
            .send();

        expect(res3.statusCode).toEqual(httpCodes.OK);
        expect(res3.body).toHaveProperty('data');
        expect(res3.body.data.title).toEqual(title);
        expect(res3.body.data.description).toEqual(description);

    });

    it('Edit Draft Success', async () => {

        const res1 = await request(app)
            .get('/api/v1/drafts/1')
            .set('Authorization', token)
            .send();

        expect(res1.statusCode).toEqual(httpCodes.OK);
        expect(res1.body).toHaveProperty('data');
        expect(res1.body.data.title).toEqual('All Around The Infinity');

        const newTitle = `Top of the world, 'ma!!`;
        const newDescription = `Don't have time to get something fancy... :'(`;

        const res2 = await request(app)
            .patch('/api/v1/drafts/1')
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
            .get('/api/v1/drafts/1')
            .set('Authorization', token)
            .send();

        expect(res3.statusCode).toEqual(httpCodes.OK);
        expect(res3.body).toHaveProperty('data');
        expect(res3.body.data.title).toEqual(newTitle);

    });

    it('Edit Article Fail due to not being owner of article', async () => {

        const res = await request(app)
            .patch('/api/v1/drafts/2')
            .set('Authorization', token)
            .send({
                "title": "bad bad title",
                "description": "does not matter",
            });

        expect(res.statusCode).toEqual(httpCodes.UNAUTHORIZED);
        expect(res.body).toStrictEqual({
            "errors": [
                "tried to edit someone else's resource (ArticleDraft)"
            ]
        });
    });

    it('Publish Draft (create new Article from Draft)', async () => {

        const title = 'test tittttle...';
        const description = 'some desc...';

        const newDraft = await request(app)
            .post('/api/v1/drafts')
            .set('Authorization', token)
            .send({
                "title": title,
                "description": description,
            });

        expect(newDraft.statusCode).toEqual(httpCodes.OK);

        let draftId = null;

        await models.ArticleDraft.findOne({
            where: {title: title}
        })
            .then(draftData => {
                expect(draftData).not.toBeNull();
                draftId = draftData.get('id');
            })
            .catch(e => {});

        await request(app)
            .patch(`/api/v1/drafts/${draftId}/publish`)
            .set('Authorization', token)
            .send();

        await models.Article.findOne({
            where: {title: title}
        })
            .then(articleData => {
                expect(articleData).not.toBeNull();
            })
            .catch(e => {});
    });
});