// src/routes/api/get.js

// import functions in src/response.js
const response = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // Send a 200 'OK' response using function from src/response.js
  res.status(200).json(
    response.createSuccessResponse({
      fragments: [],
    })
  );
};
