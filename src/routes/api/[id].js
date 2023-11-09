// src/routes/api/[id].js

// import functions in src/response.js
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');

/**
 * Returns an existing fragment (only plain text support required at this point)
 */
module.exports = async (req, res) => {
  logger.debug('GET /fragments/:id route accessed');

  let ext = '';
  let convertToType = '';
  let currentType = '';
  let futureTypes = [];
  let data = '';

  // Get id from dynamic value from url
  let id = req.params.id;

  // Get extension
  ext = path.extname(id);
  // Get id without extension
  id = path.parse(id).name;

  try {
    // Check if id represents known fragment
    let fragment = await Fragment.byId(req.user, id);

    // Get fragment data
    data = await fragment.getData();

    // Check if extension is provided - meaning we have to convert the fragment
    if (ext) {
      // Get the desired conversion type from the extension
      if (ext === 'txt') {
        convertToType = 'text/plain';
      } else if (ext === 'md') {
        convertToType = 'text/markdown';
      } else if (ext === 'html') {
        convertToType = 'text/html';
      } else if (ext === 'png' || ext === 'webp' || ext === 'gif') {
        convertToType = `image/${ext}`;
      } else if (ext === 'jpg' || ext === 'jpeg') {
        convertToType = 'image/jpeg';
      } else if (ext === 'json') {
        convertToType = 'application/json';
      }

      // Check if desired conversion type is supported
      if (Fragment.isSupportedType(convertToType)) {
        // Get current type of the fragment
        currentType = fragment.type;

        // Get list of types the current fragment can be converted into
        futureTypes = fragment.formats;

        // Check if desired type is one of the types we can convert into
        if (futureTypes.includes(convertToType)) {
          // Return the raw fragment data using the desired type (for now this can only be text)
          res.status(200).json(
            response.createSuccessResponse({
              data: data.toString(),
            })
          );
        } else {
          // return HTTP 404 with error message
          res
            .status(415)
            .json(
              response.createErrorResponse(
                415,
                `a ${currentType} fragment cannot be returned as a ${convertToType}`
              )
            );
        }
      } else {
        // return HTTP 404 with error message
        res
          .status(415)
          .json(response.createErrorResponse(415, 'extension does not represent a supported type'));
      }
    } else {
      // No extension, no need to convert the fragment
      // Return the raw fragment data using the type specified when created (for now this can only be text)
      res.status(200).json(
        response.createSuccessResponse({
          data: data.toString(),
        })
      );
    }
  } catch (e) {
    // Fragment not found, return HTTP 404 with error message
    res.status(404).json(response.createErrorResponse(404, e));
  }
};
