// src/routes/api/delete.js

// import functions in src/response.js
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Deletes an existing fragment
 */
module.exports = async (req, res) => {
  try {
    logger.debug('DELETE /fragments/:id route accessed');

    // Get id from dynamic value from url
    let id = req.params.id;

    // Get existing fragment, will throw if failed
    await Fragment.byId(req.user, id);

    // Delete user fragment
    await Fragment.delete(req.user, id);

    // Send a 200 'OK' response
    res.status(200).json(response.createSuccessResponse({}));
  } catch (e) {
    // Fragment not found, return HTTP 404 with error message
    res.status(404).json(response.createErrorResponse(404, e));
  }
};
