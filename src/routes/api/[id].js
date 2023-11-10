// src/routes/api/[id].js

// import functions in src/response.js
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');
const markdownIt = require('markdown-it'),
  md = new markdownIt();

// Function to get the data type from an extension
function getDataType(ext) {
  if (ext === '.txt') {
    return 'text/plain';
  } else if (ext === '.md') {
    return 'text/markdown';
  } else if (ext === '.html') {
    return 'text/html';
  } else if (ext === '.png' || ext === '.webp' || ext === '.gif') {
    return `image/${ext}`;
  } else if (ext === '.jpg' || ext === '.jpeg') {
    return 'image/jpeg';
  } else if (ext === '.json') {
    return 'application/json';
  } else {
    return '';
  }
}

/**
 * Returns an existing fragment
 */
module.exports = async (req, res) => {
  logger.debug('GET /fragments/:id route accessed');

  let ext = '';
  let convertToType = '';
  let currentType = '';
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

    // Get current type of the fragment
    currentType = fragment.type;

    // Get the desired conversion data type from the extension
    convertToType = getDataType(ext);

    if (ext === '') {
      // No extension supplied (no request for conversion)
      // Return the raw fragment data using the type specified when created (for now this can only be text)
      res.status(200).json(
        response.createSuccessResponse({
          data: data.toString(),
        })
      );
    } else if (Fragment.isSupportedType(convertToType)) {
      // Extension was supplied and it is a supported data type

      // Check if desired type is one of the types we can convert into
      if (fragment.formats.includes(convertToType)) {
        let convertedData = data.toString();

        if (currentType == 'text/markdown' && convertToType == 'text/html') {
          // Convert markdown -> html using markdown-it
          convertedData = md.render(data.toString());
          logger.debug('Markdown data converted to HTML');
        }

        // Return the raw fragment data using the desired type
        res.status(200).json(
          response.createSuccessResponse({
            data: convertedData,
          })
        );
      } else {
        // The desired type is supported but it is not a type that current type can convert into
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
  } catch (e) {
    // Fragment not found, return HTTP 404 with error message
    res.status(404).json(response.createErrorResponse(404, e));
  }
};
