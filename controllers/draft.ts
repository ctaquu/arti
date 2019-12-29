import * as httpCodes from 'http-status-codes';

const models = require('../database/models/index');
const mapper = require('../mappers/draft');
const auth = require('../common/auth');

/**
 *
 * @param request
 * @param response
 */
exports.list = async (request, response) => {

    const user = await auth.getUserFromToken(request.headers.authorization);

    models.ArticleDraft.findAll({
        where: {userId: user.get('id')},
        attributes: ['id', 'title', 'description'],
        include: [
            {
                model: models.User,
            },
        ]
    })
        .then(draftData => {

            response.status(httpCodes.OK).json({
                data: draftData.map(draftDatum => mapper.map(draftDatum))
            })
        })
        .catch(e => {
            console.error('E0026', e.toString())
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0026',
                errors: [e.toString()],
            })
        });
};

/**
 *
 * @param request
 * @param response
 */
exports.get = (request, response) => {

    const {id} = request.params;

    models.ArticleDraft.findOne({
        where: {id: request.params.id},
        attributes: ['id', 'title', 'description'],
        include: [
            {
                model: models.User,
            },
        ]
    })
        .then(draftData => {
            if (draftData === null) {
                console.error('E0027', 'Draft not found');
                response.status(httpCodes.BAD_REQUEST).json({
                    code: 'E0027',
                    errors: [`Draft with ID: ${id} not found`],
                });
                return
            }
            response.status(httpCodes.OK).json({
                data: mapper.map(draftData),
            })
        })
        .catch(e => {
            console.error('E0028', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0028',
                errors: [e.toString()],
            })
        });
};

/**
 *
 * @param request
 * @param response
 */
exports.new = async (request, response) => {

    const {title, description} = request.body;
    const user = await auth.getUserFromToken(request.headers.authorization);

    // create new Article Draft
    await models.ArticleDraft.create({
        userId: user.get('id'),
        title: title,
        description: description,
    })
        .then(() => {
            response.status(httpCodes.OK).json({
                result: 'created'
            })
        })
        .catch(e => {
            console.error('E0029', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0029',
                errors: [e.toString()],
            })
        });
};

/**
 *
 * @param request
 * @param response
 */
exports.edit = async (request, response) => {

    const {title, description} = request.body;
    const draftId = request.params.id;

    models.ArticleDraft.update({
        title: title,
        description: description,
    }, {
        where: {id: draftId}
    })
        .then(() => {
            response.status(httpCodes.OK).json({
                result: 'edited'
            })
        })
        .catch(e => {
            console.error('E0030', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0030',
                errors: [e.toString()],
            })
        });
};

/**
 *
 * create new article from draft
 *
 * @param request
 * @param response
 */
exports.publish = async (request, response) => {

    let title = null;
    let description = null;

    await models.ArticleDraft.findOne({
        where: {id: request.params.id},
        attributes: ['id', 'title', 'description'],
        include: [
            {
                model: models.User,
            },
        ]
    })
        .then(draftData => {
            title = draftData.get('title');
            description = draftData.get('description');
        })
        .catch(e => {
            console.error('E0035', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0035',
                errors: [e.toString()],
            })
        });

    // const {title, description} = request.body;
    const user = await auth.getUserFromToken(request.headers.authorization);

    let articleVersionId = null;
    let articleId = null;

    // create new Article
    await models.Article.create({
        isPublished: false,
        userId: user.get('id'),
    })
        .then(result => {
            articleId = result.get('id');
        })
        .catch(e => {
            console.error('E0032', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0032',
                errors: [e.toString()],
            })
        });

    // create new ArticleVersion
    await models.ArticleVersion.create({
        title: title,
        description: description,
        articleId: articleId,
    })
        .then(result => {
            articleVersionId = result.get('id');
        })
        .catch(e => {
            console.error('E0033', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0033',
                errors: [e.toString()],
            })
        });

    // set newly created ArticleVersion as current/active for the new Article
    models.Article.update({
        articleVersionId: articleVersionId
    }, {
        where: {id: articleId}
    })
        .then(() => {
            response.status(httpCodes.OK).json({
                result: 'created'
            })
        })
        .catch(e => {
            console.error('E0034', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0034',
                errors: [e.toString()],
            })
        })
};
