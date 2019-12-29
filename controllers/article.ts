import * as httpCodes from 'http-status-codes';

const models = require('../database/models/index');
const mapper = require('../mappers/article');
const auth = require('../common/auth');

/**
 *
 * @param request
 * @param response
 */
exports.list = (request, response) => {

    models.Article.findAll({
        attributes: ['id', 'isPublished'],
        include: [
            {
                model: models.User,
            },
            {
                model: models.ArticleVersion,
                as: 'CurrentArticleVersion',
            },
        ]
    })
        .then(articleData => {

            response.status(httpCodes.OK).json({
                data: articleData.map(articleDatum => mapper.map(articleDatum))
            })
        })
        .catch(e => {
            console.error('E0010', e.toString())
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0010',
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

    models.Article.findOne({
        where: {id: request.params.id},
        attributes: ['id', 'isPublished'],
        include: [
            {
                model: models.User,
            },
            // {
            //     model: models.ArticleVersion,
            //     as: 'AllArticleVersions',
            // },
            {
                model: models.ArticleVersion,
                as: 'CurrentArticleVersion',
            },
        ]
    })
        .then(articleData => {
            if (articleData === null) {
                console.error('E0023', 'Article not found');
                response.status(httpCodes.BAD_REQUEST).json({
                    code: 'E0023',
                    errors: [`Article with ID: ${id} not found`],
                });
                return
            }
            response.status(httpCodes.OK).json({
                data: mapper.map(articleData),
            })
        })
        .catch(e => {
            console.error('E0012', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0012',
                errors: [e.toString()],
            })
        });
};

/**
 *
 * @param request
 * @param response
 */
exports.history = (request, response) => {

    const {id} = request.params;

    models.Article.findOne({
        where: {id: request.params.id},
        attributes: ['id', 'isPublished'],
        include: [
            {
                model: models.User,
            },
            {
                model: models.ArticleVersion,
                as: 'AllArticleVersions',
            },
        ]
    })
        .then(articleData => {
            if (articleData === null) {
                console.error('E0024', 'Article not found');
                response.status(httpCodes.BAD_REQUEST).json({
                    code: 'E0024',
                    errors: [`Article with ID: ${id} not found`],
                });
                return
            }
            response.status(httpCodes.OK).json({
                data: articleData.AllArticleVersions.map(articleVersion => {
                    return {
                        id: articleData.get('id'),
                        isPublished: articleData.get('isPublished'),
                        user: {
                            id: articleData.User.id,
                            name: articleData.User.name,
                        },
                        title: articleVersion.title,
                        description: articleVersion.description,
                        versionId: articleVersion.id,
                    }
                })
            })
        })
        .catch(e => {
            console.error('E0025', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0025',
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
            console.error('E0021', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0021',
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
            console.error('E0022', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0022',
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
            console.error('E0023', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0023',
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
    const articleId = request.params.id;

    let articleVersionId = null;

    // get the Article in question
    await models.Article.findOne({
        where: {id: articleId}
    })
        .then(() => {
        })
        .catch(e => {
            console.error('E0018', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0018',
                errors: [e.toString()],
            })
        });

    // create new (aka: latest, aka: current) articleVersion
    await models.ArticleVersion.create({
        title: title,
        description: description,
        articleId: articleId,
    })
        .then(result => {
            articleVersionId = result.get('id');
        })
        .catch(e => {
            console.error('E0017', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0017',
                errors: [e.toString()],
            })
        });

    // set newly created ArticleVersion as current/active for the Article in question
    models.Article.update({
        articleVersionId: articleVersionId
    }, {
        where: {id: articleId}
    })
        .then(() => {
            response.status(httpCodes.OK).json({
                result: 'edited'
            })
        })
        .catch(e => {
            console.error('E0013', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0013',
                errors: [e.toString()],
            })
        });
};

/**
 *
 * @param request
 * @param response
 */
exports.setVersion = async (request, response) => {

    const {versionId} = request.body;
    const articleId = request.params.id;

    // set submitted version for the Article in question
    models.Article.update({
        articleVersionId: versionId
    }, {
        where: {id: articleId}
    })
        .then(() => {
            response.status(httpCodes.OK).json({
                result: 'version switched'
            })
        })
        .catch(e => {
            console.error('E0025', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0025',
                errors: [e.toString()],
            })
        });
};

/**
 *
 * @param request
 * @param response
 */
exports.publish = (request, response) => {

    models.Article.update({isPublished: true}, {
        where: {id: request.params.id}
    })
        .then(result => {
            response.status(httpCodes.OK).json({
                result: 'published'
            })
        })
        .catch(e => {
            console.error('E0014', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0014',
                errors: [e.toString()],
            })
        });
};

/**
 *
 * @param request
 * @param response
 */
exports.unpublish = (request, response) => {

    models.Article.update({isPublished: false}, {
        where: {id: request.params.id}
    })
        .then(result => {
            response.status(httpCodes.OK).json({
                result: 'unpublished'
            })
        })
        .catch(e => {
            console.error('E0016', e.toString());
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                code: 'E0016',
                errors: [e.toString()],
            })
        });
};