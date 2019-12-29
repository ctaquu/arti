import * as constants from '../common/constants';
const httpCodes = require('http-status-codes');
const moment = require('moment');
const utils = require("../common/utils");
const models = require('../database/models/index');
const _ = require('lodash');

/**
 *
 * @param request
 * @param response
 */
exports.login = (request, response) => {

    const {email, password} = request.body;

    models.User.findOne({
        where: {
            email: email,
        },
        attributes: ['password', 'id']
    })
        .then(userData => {

            if (utils.isNullOrUndefined(userData)) {
                console.error('E0009', 'invalid credentials')
                response.status(httpCodes.UNAUTHORIZED).send({
                    errors: [
                        'invalid credentials'
                    ]
                });

                return;
            }

            if (utils.isPasswordValid(password, userData.get('password'))) {

                    // creds ok, issue new token
                    models.UserToken.create({
                        userId: userData.get('id'),
                        token: utils.generateToken(),
                        expires: moment().add(constants.TOKEN_TTL, 'minutes').valueOf(),
                    })
                        .then(loginData => {
                            response.status(httpCodes.ACCEPTED).send({
                                data: _.pick(loginData, ['token', 'expires'])
                            })
                        })
                } else {
                    response.status(httpCodes.UNAUTHORIZED).send({
                        errors: [
                            'invalid credentials'
                        ]
                    })
                }
            });

};
