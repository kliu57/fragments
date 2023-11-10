// src/routes/api/[id]/info.js

// import functions in src/response.js
const response = require('../../../response');
const { Fragment } = require('../../../model/fragment');
const logger = require('../../../logger');

/**
 * Returns the metadata for one of their existing fragments with the specified id.
 * If no such fragment exists, returns an HTTP 404 with an appropriate error message.
 * {
  "status": "ok",
  "fragment": {
    "id": "fdf71254-d217-4675-892c-a185a4f1c9b4",
    "ownerId": "11d4c22e42c8f61feaba154683dea407b101cfd90987dda9e342843263ca420a",
    "created": "2021-11-02T15:09:50.403Z",
    "updated": "2021-11-02T15:09:50.403Z",
    "type": "text/plain",
    "size": 1024
  }
}
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
