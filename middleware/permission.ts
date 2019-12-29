const httpCodes = require("http-status-codes");

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
    }
};