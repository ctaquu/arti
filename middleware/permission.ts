const httpCodes = require("http-status-codes");
import * as models from '../database/models/index';

module.exports = {
    /**
     *
     * @param params
     */
    required: (...params: Array<string>) => (request, response, next) => {

        const missingParams: Array<string> = [];

        params.map(param => {
            if (!request.body.hasOwnProperty(param) && !request.params.hasOwnProperty(param)) {
                missingParams.push(param);
            }
        });

        if (missingParams.length > 0) {
            response.status(httpCodes.BAD_REQUEST).json({
                errors: missingParams.map(missingParam => `missing parameter: ${missingParam}`)
            });

            return;
        }

        // all required params valid, so continue on the next middleware
        next();
    },
    /**
     *
     * @param params
     */
    allowed: (...params: Array<string>) => (request, response, next) => {

        const notAllowedParams: Array<string> = [];

        Object.entries(request.body).map(bodyParam => {
            if (params.indexOf(bodyParam[0]) === -1) {
                notAllowedParams.push(bodyParam[0]);
            }
        });

        Object.entries(request.params).map(paramsParam => {
            if (params.indexOf(paramsParam[0]) === -1) {
                notAllowedParams.push(paramsParam[0]);
            }
        });

        if (notAllowedParams.length > 0) {
            response.status(httpCodes.BAD_REQUEST).json({
                errors: notAllowedParams.map(missingParam => `not allowed parameter: ${missingParam}`)
            });

            return;
        }

        // all required params are allowed, so continue on the next middleware
        next();
    },
    /**
     *
     * @param resourceType
     */
    owner: (resourceType) => async (request, response, next) => {

        const idToken = request.headers.authorization;
        const bareToken = idToken.substring(7);
        const resourceId = request.params.id;
        await models.UserToken.findOne({
            where: {
                token: bareToken,
            },
            attributes: ['userId']
        })
            .then(async userTokenData => {
                await models[resourceType].findByPk(resourceId)
                    .then(resourceData => {
                        if (resourceData.get('userId') !== userTokenData.get('userId')) {
                            response.status(httpCodes.UNAUTHORIZED).json({
                                errors: [`tried to edit someone else's resource (${resourceType})`]
                            });
                            return
                        }
                        // all gooochy!!
                        next()
                    })
            });
    }

};