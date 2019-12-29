import * as httpCodes from "http-status-codes";
const utils = require('../common/utils');
const moment = require("moment");
const models = require('../database/models/index');
const Op = models.Sequelize.Op;

module.exports = {
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    requireAuthentication: (request, response, next) => {

        const idToken = request.headers.authorization;

        // no token sent in the header
        if (utils.isNullOrUndefined(idToken)) {
            console.error('E0007', 'missing token');
            response.status(httpCodes.BAD_REQUEST).json({
                code: 'E0007',
                errors: [
                    'missing token'
                ],
            })
        }

        const bareToken = idToken.substring(7);

        // check if it exists and has NOT expired
        models.UserToken.findOne({
            where: {
                token: bareToken,
                expires: {
                    [Op.gt]: moment().toDate(),
                }
            },
            attributes: ['id']})
            .then(userTokenData => {
                if (utils.isNullOrUndefined(userTokenData)) {
                    console.error('E0008', 'invalid or expired token');
                    response.status(httpCodes.UNAUTHORIZED).json({
                        code: 'E0008',
                        errors: [
                            'invalid or expired token'
                        ],
                    });
                } else {
                    // all peachy!!
                    next();
                }
            })
            .catch(e => {
                console.error('E0006', e);
                response.status(httpCodes.INTERNAL_SERVER_ERROR).json({
                    code: 'E0006',
                    errors: [
                        e.toString(),
                    ],
                });
            })
    }
};