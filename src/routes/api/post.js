// src/routes/api/post.js

// import functions in src/response.js
const response = require('../../response');

const { Fragment } = require('../../model/fragment');

const logger = require('../../logger');

// /**
//  * Creates a new fragment for the current user (i.e., authenticated user)
//  */
module.exports = async (req, res) => {
  logger.debug('POST /fragments route accessed');

  // Check if we can parse this content type
  if (Buffer.isBuffer(req.body) === true && req.is('text/plain')) {
    // create new fragment
    const fragment = new Fragment({
      ownerId: req.user,
      type: 'text/plain',
      size: 0,
    });

    // set fragment data to raw binary data in the body of the request
    await fragment.setData(req.body);

    // save fragment to db
    await fragment.save();

    // Get current host name
    const host = `https://${req.headers.host}` || process.env.API_URL;

    let url = new URL(`/v1/fragments/${fragment.id}`, host);

    logger.debug(`Location url is: ${url}`);
    logger.debug(`post metadata: ${JSON.stringify(fragment)}`);

    // return HTTP 201 with Location header with full URL of new fragment
    res
      .status(201)
      .setHeader('Location', url)
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
          'Content-Type of fragment sent with request is not supported'
        )
      );
  }
};
