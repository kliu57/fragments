// src/routes/api/[id].js

// import functions in src/response.js
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');
const markdownIt = require('markdown-it'),
  md = new markdownIt();

/**
 * Returns an existing fragment
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
  ext = path.extname(id).substring(1);
  // Get id without extension
  id = path.parse(id).name;

  try {
    // Check if id represents known fragment
    let fragment = await Fragment.byId(req.user, id);

    // Get fragment data
    data = await fragment.getData();

    // Get current type of the fragment
    currentType = fragment.type;

    // Check if extension is provided - meaning we have to convert the fragment
    if (ext) {
      // Get the full name of desired conversion type from the extension
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

      // Check if the desired conversion type has a full name
      if (convertToType != '') {
        // Check if type is supported
        if (Fragment.isSupportedType(convertToType)) {
          // Get list of types the current fragment can be converted into
          futureTypes = fragment.formats;

          // Check if desired type is one of the types we can convert into
          if (futureTypes.includes(convertToType)) {
            let convertedData = data.toString();

            if (currentType == 'text/markdown' && convertToType == 'text/html') {
              // Convert markdown -> html using markdown-it
              convertedData = md.render(data.toString());
              logger.debug('Markdown data converted to HTML');
            }

            // Return the raw fragment data using the desired type (for now this can only be text)
            res.status(200).json(
              response.createSuccessResponse({
                data: convertedData,
              })
            );
          } else {
            // return HTTP 415 with error message
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
          console.log('here');
          // return HTTP 404 with error message
          res
            .status(415)
            .json(
              response.createErrorResponse(415, 'extension does not represent a supported type')
            );
        }
      } else {
        // Type has no full name, so it is unsupported
        // return HTTP 415 with error message
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
      // No extension (no request for conversion) or the current type is already the desired type
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
