// src/routes/api/put.js

// import functions in src/response.js
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Updates an existing fragment
 */
module.exports = async (req, res) => {
  try {
    logger.debug('PUT /fragments/:id route accessed');

    // Get id from dynamic value from url
    let id = req.params.id;

    // Get existing fragment
    let fragment = await Fragment.byId(req.user, id);

    // Get type of existing fragment
    let existingType = fragment.type;

    // Get request Content-Type
    let newType = req.headers['content-type'];

    logger.debug(Buffer.isBuffer(req.body));
    logger.debug(`new fragment type is ${newType}`);
    logger.debug(`existing fragment type is ${existingType}`);

    // Check if Content-Type of the request matches the existing fragment's type
    if (newType == existingType) {
      if (Buffer.isBuffer(req.body) === true) {
        // set existing fragment data to raw binary data in the body of the request
        await fragment.setData(req.body);

        // Get current host name
        const host = process.env.API_URL || `http://${req.headers.host}`;

        let url = new URL(`/v1/fragments/${fragment.id}`, host);

        logger.debug(`Location url is: ${url}`);
        logger.debug(`post metadata: ${JSON.stringify(fragment)}`);

        // return HTTP 200 with Location header with full URL of new fragment
        res
          .status(200)
          .location(url)
          .json(
            response.createSuccessResponse({
              fragment: fragment,
            })
          );
      } else {
        // return HTTP 415 with error message
        res
          .status(415)
          .json(
            response.createErrorResponse(
              415,
              'Content-Type of fragment sent with request is not supported:' + existingType
            )
          );
      }
    } else {
      // Fragment type does not match, return HTTP 400 with error message
      res.status(400).json(response.createErrorResponse(400, 'Fragment types does not match'));
    }
  } catch (e) {
    // Fragment not found, return HTTP 404 with error message
    res.status(404).json(response.createErrorResponse(404, e.message));
  }
};
