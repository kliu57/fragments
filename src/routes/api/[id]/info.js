// src/routes/api/[id]/info.js

// import functions in src/response.js
const response = require('../../../response');
const { Fragment } = require('../../../model/fragment');
const logger = require('../../../logger');

/**
 * Returns the metadata for an existing fragment with the specified id
 * If no such fragment exists, returns HTTP 404
 */
module.exports = async (req, res) => {
  logger.debug('GET /fragments/:id/info route accessed');

  let metadata = '';

  // Get id from dynamic value from url
  let id = req.params.id;

  try {
    // Check if id represents known fragment
    let fragment = await Fragment.byId(req.user, id);

    // Get fragment metadata
    metadata = await fragment.getMetaData();

    // Return the fragment metadata
    res.status(200).json(
      response.createSuccessResponse({
        fragment: metadata,
      })
    );
  } catch (e) {
    // Fragment not found, return HTTP 404 with error message
    res.status(404).json(response.createErrorResponse(404, e));
  }
};
