// src/routes/api/get.js

// import functions in src/response.js
const response = require('../../response');

const { Fragment } = require('../../model/fragment');

const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  logger.debug('GET /fragments route accessed');

  // Get user fragments
  let fragments = await Fragment.byUser(req.user, false);

  // Send a 200 'OK' response using function from src/response.js
  res.status(200).json(
    response.createSuccessResponse({
      fragments: fragments,
    })
  );
};
