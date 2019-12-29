import * as models from '../database/models/index';

module.exports = {
    getUserFromToken: async (token) => {
        return new Promise(((resolve, reject) => {
            const bareToken = token.substring(7);
            models.UserToken.findOne({
                where: {
                    token: bareToken,
                },
                attributes: ['userId']
            })
                .then(async UserTokenData => {
                    await models.User.findOne({
                        where: {
                            id: UserTokenData.get('userId'),
                        }
                    })
                        .then(async UserTokenData => {
                            resolve(UserTokenData)
                        })
                        .catch(e => {
                            console.error('E0020', e.toString());
                            reject(e)
                        })
                })
                .catch(e => {
                    console.error('E0019', e.toString());
                    reject(e)
                })
        }))
    }
};