// pick the appropriate back-end data strategy (we currently only have 1, our memory strategy, but we'll add ones for AWS later)

// re-export the memory module:
module.exports = require('./memory');
