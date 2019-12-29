import * as httpCodes from 'http-status-codes';

exports.list = (request, response) => {

    response.status(httpCodes.OK).json({
        data: [],
    })
};
