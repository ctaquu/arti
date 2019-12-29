import bodyParser from 'body-parser';
const httpCodes = require("http-status-codes");
const usersController = require('./controllers/user');
const articlesController = require('./controllers/article');
const auth = require('./middleware/auth');
const permission = require('./middleware/permission');
const jsonParser = bodyParser.json();

module.exports = function(router){

    /**
     * just a server availability (public) endpoint
     */
    router.get("/ping", (request, response) => {
        response.status(httpCodes.ACCEPTED).json({status: 'ping A-OK'});
    });

    /**
     * fetching token using email/password credentials
     */
    router.post('/users/token', jsonParser, [
        permission.required('email', 'password'),
        usersController.login,
    ]);

    /**
     * all following endpoints require auth token
     */
    router.all('/*', auth.requireAuthentication);

    /**
     * just a server availability (protected) endpoint
     */
    router.get("/ping/protected", (request, response) => {
        response.status(httpCodes.ACCEPTED).json({status: 'protected ping A-OK'});
    });

    /**
     * list all articles
     */
    router.get('/articles', jsonParser, [
        articlesController.list
    ]);

    /**
     * create new article
     */
    router.post('/articles', jsonParser, [
        permission.required('title', 'description'),
        articlesController.new
    ]);

    /**
     * get one article
     */
    router.get('/articles/:id', jsonParser, [
        permission.required('id'),
        articlesController.get
    ]);

    /**
     * get article history
     */
    router.get('/articles/:id/history', jsonParser, [
        permission.required('id'),
        articlesController.history
    ]);

    /**
     * set article version from history
     */
    router.patch('/articles/:id/version', jsonParser, [
        permission.required('id', 'versionId'),
        permission.owner('Article'),
        articlesController.setVersion
    ]);

    /**
     *  edit article
     */
    router.patch('/articles/:id', jsonParser, [
        permission.required('id', 'title', 'description'),
        permission.owner('Article'),
        articlesController.edit
    ]);

    /**
     * publish article
     */
    router.patch('/articles/:id/publish', jsonParser, [
        permission.required('id'),
        permission.owner('Article'),
        articlesController.publish
    ]);

    /**
     *  unpublish article
     */
    router.patch('/articles/:id/unpublish', jsonParser, [
        permission.required('id'),
        permission.owner('Article'),
        articlesController.unpublish
    ]);
};
